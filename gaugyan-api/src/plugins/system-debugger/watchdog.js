const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Basic AI Watchdog Implementation
// Runs every minute to check system health

class Watchdog {
    constructor() {
        this.isJobRunning = false;
        // In production, we assume we are running from the app root
        this.projectRoot = process.cwd();
    }

    start() {
        console.log('[System Debugger] AI Watchdog started. Schedule: * * * * *');

        // Run every minute
        cron.schedule('* * * * *', async () => {
            if (this.isJobRunning) return;
            this.isJobRunning = true;

            try {
                await this.performHealthCheck();
            } catch (error) {
                console.error('[System Debugger] Watchdog failed:', error);
            } finally {
                this.isJobRunning = false;
            }
        });
    }

    async performHealthCheck() {
        // 1. Check Disk Space (Simulated by checking write access to logs dir)
        try {
            const logsDir = path.join(this.projectRoot, 'logs');
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
            }
            const testFile = path.join(logsDir, 'health_check.tmp');
            fs.writeFileSync(testFile, 'OK');
            fs.unlinkSync(testFile);
        } catch (e) {
            this.reportIssue('CRITICAL', 'Filesystem is not writable', e.message);
        }

        // 2. Scan specific log file for "Error"
        // Adjust for production log file name
        const logFile = path.join(this.projectRoot, 'logs/server_output.log');
        if (fs.existsSync(logFile)) {
            try {
                // Read only the last 2000 bytes to avoid memory issues with huge logs
                const stats = fs.statSync(logFile);
                const size = stats.size;
                const bufferSize = Math.min(2000, size);
                const buffer = Buffer.alloc(bufferSize);
                const fd = fs.openSync(logFile, 'r');
                fs.readSync(fd, buffer, 0, bufferSize, size - bufferSize);
                fs.closeSync(fd);

                const logs = buffer.toString();
                if (logs.includes('ECONNREFUSED')) {
                    this.reportIssue('HIGH', 'Database connection refused detected.');
                }
            } catch (readErr) {
                // Ignore read errors
            }
        }
    }

    reportIssue(severity, message, details = '') {
        console.error(`[AI Watchdog ALERT] [${severity}] ${message} ${details}`);
    }
}

module.exports = new Watchdog();
