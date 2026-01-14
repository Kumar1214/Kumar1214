const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const TerminalService = require('../../shared/services/TerminalService');
const { protect, authorize } = require('../../shared/middleware/protect');

// Base path for file operations (Restricted to project root for now)
const BASE_PATH = path.resolve(__dirname, '../../../../');

// Apply security middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/file-manager/files
// @desc    List files in a directory
router.get('/files', async (req, res) => {
    try {
        const { dir = '' } = req.query;
        // Basic security check: prevent directory traversal outside root
        if (dir.includes('..')) {
            return res.status(403).json({ success: false, message: 'Access Denied: Path traversal detected.' });
        }

        const targetPath = path.join(BASE_PATH, dir);

        if (!fs.existsSync(targetPath)) {
            return res.status(404).json({ success: false, message: 'Directory not found.' });
        }

        const items = fs.readdirSync(targetPath, { withFileTypes: true });

        const files = items.map(item => ({
            name: item.name,
            type: item.isDirectory() ? 'directory' : 'file',
            path: path.join(dir, item.name),
            size: item.isDirectory() ? 0 : fs.statSync(path.join(targetPath, item.name)).size
        }));

        res.json({ success: true, data: files, currentPath: dir });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/file-manager/content
// @desc    Read file content
router.get('/content', async (req, res) => {
    try {
        const { filePath } = req.query;
        if (!filePath || filePath.includes('..')) {
            return res.status(400).json({ success: false, message: 'Invalid file path.' });
        }

        const fullPath = path.join(BASE_PATH, filePath);

        // Prevent reading sensetive files (like .env) via this endpoint unless admin overrides
        if (filePath.includes('.env')) {
            // return res.status(403).json({ success: false, message: 'Access to .env is restricted.' });
        }

        const content = fs.readFileSync(fullPath, 'utf8');
        res.json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/file-manager/save
// @desc    Save file content (AI Edit)
router.post('/save', async (req, res) => {
    try {
        const { filePath, content } = req.body;
        if (!filePath || filePath.includes('..')) {
            return res.status(400).json({ success: false, message: 'Invalid file path.' });
        }

        const fullPath = path.join(BASE_PATH, filePath);
        fs.writeFileSync(fullPath, content, 'utf8');

        res.json({ success: true, message: 'File saved successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/file-manager/terminal
// @desc    Execute terminal command
router.post('/terminal', async (req, res) => {
    try {
        const { command } = req.body;
        if (!command) return res.status(400).json({ message: 'Command required' });

        const output = await TerminalService.execute(command);
        res.json({ success: true, output });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, stderr: error.stderr });
    }
});

module.exports = router;
