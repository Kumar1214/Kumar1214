const express = require('express');
const fs = require('fs');
const path = require('path');
const { protect, authorize } = require('../../shared/middleware/protect');
const watchdog = require('./watchdog');

// Start Watchdog immediately when plugin is loaded
watchdog.start();

const router = express.Router();

router.use((req, res, next) => {
    console.log('--- SYSTEM DEBUGGER ROUTER HIT ---', req.originalUrl);
    next();
});

// Middleware wrapper for role check
const restrictTo = (...roles) => authorize(...roles);

// Helper to validate path
const validatePath = (requestedPath) => {
    const rootPath = path.resolve(__dirname, '../../../../'); // Project root
    const fullPath = path.resolve(rootPath, requestedPath.replace(/^\//, '')); // relative to root

    // Security check: Prevent directory traversal
    if (!fullPath.startsWith(rootPath)) {
        throw new Error('Access denied: Path verification failed.');
    }

    // Security check: Block sensitive files
    if (fullPath.includes('.env') || fullPath.includes('.git') || fullPath.includes('node_modules')) {
        throw new Error('Access denied: Sensitive file.');
    }

    return fullPath;
};

// GET /files?path=/
router.get('/files', protect, restrictTo('admin'), (req, res) => {
    try {
        const dirPath = validatePath(req.query.path || '');

        if (!fs.existsSync(dirPath)) {
            return res.status(404).json({ success: false, message: 'Directory not found' });
        }

        const stats = fs.statSync(dirPath);
        if (!stats.isDirectory()) {
            return res.status(400).json({ success: false, message: 'Path is not a directory' });
        }

        const items = fs.readdirSync(dirPath).map(item => {
            const itemPath = path.join(dirPath, item);
            let itemStats;
            try {
                itemStats = fs.statSync(itemPath);
            } catch (e) {
                return null;
            }

            return {
                name: item,
                type: itemStats.isDirectory() ? 'directory' : 'file',
                size: itemStats.size,
                modified: itemStats.mtime
            };
        }).filter(Boolean);

        // Sort: Directories first
        items.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'directory' ? -1 : 1;
        });

        res.json({
            success: true,
            data: {
                currentPath: req.query.path || '/',
                items
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /read?path=/package.json
router.get('/read', protect, restrictTo('admin'), (req, res) => {
    try {
        const filePath = validatePath(req.query.path || '');

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        const stats = fs.statSync(filePath);
        if (stats.size > 1024 * 1024 * 5) { // 5MB limit
            return res.status(400).json({ success: false, message: 'File too large to view' });
        }

        const content = fs.readFileSync(filePath, 'utf8');
        res.json({
            success: true,
            data: content
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /system-status
router.get('/system-status', protect, restrictTo('admin'), async (req, res) => {
    try {
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();

        // Check DB connection (rudimentary)
        // Ideally import db instance, but for now we assume alive if server runs
        // We can check local sqlite file size
        const dbPath = path.resolve(__dirname, '../../../../database.sqlite');
        const dbSize = fs.existsSync(dbPath) ? fs.statSync(dbPath).size : 0;

        res.json({
            success: true,
            data: {
                uptime,
                memory: {
                    rss: memoryUsage.rss,
                    heapTotal: memoryUsage.heapTotal,
                    heapUsed: memoryUsage.heapUsed,
                },
                dbSize,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /logs?type=output|debug&lines=100
router.get('/logs', protect, restrictTo('admin'), (req, res) => {
    try {
        const type = req.query.type || 'output';
        const lines = parseInt(req.query.lines) || 100;

        const logFile = type === 'debug' ? 'server_debug.log' : 'server_output.log';
        const logPath = path.resolve(__dirname, '../../../../', logFile);

        if (!fs.existsSync(logPath)) {
            return res.json({ success: true, data: 'Log file empty or not found.' });
        }

        // Read last N lines roughly (reading full file might be heavy)
        // For simplicity in cPanel, we utilize 'read-last-lines' if avail, or just read file if small.
        // Given constraint, let's read file (carefully)
        const stats = fs.statSync(logPath);
        const fileSize = stats.size;

        // Read last 50KB if file is large
        const bufferSize = Math.min(50 * 1024, fileSize);
        const buffer = Buffer.alloc(bufferSize);
        const fd = fs.openSync(logPath, 'r');
        fs.readSync(fd, buffer, 0, bufferSize, fileSize - bufferSize);
        fs.closeSync(fd);

        const content = buffer.toString('utf8');
        // Simple manual split to get last lines
        const allLines = content.split('\n');
        const lastLines = allLines.slice(-lines).join('\n');

        res.json({
            success: true,
            data: lastLines
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
