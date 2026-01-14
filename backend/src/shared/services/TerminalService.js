const { exec } = require('child_process');
const path = require('path');

/**
 * TerminalService
 * Provides a bridge for the "Autonomous AI" to execute system commands.
 * CRITICAL: This grants partial shell access.
 */
class TerminalService {
    constructor() {
        // Base command to ensure we are in the correct environment
        this.baseEnv = 'source /home/gaugyanc/nodevenv/gaugyan-api/20/bin/activate && cd /home/gaugyanc/gaugyan-api';
    }

    /**
     * Execute a shell command within the application environment
     * @param {string} command - The command to run (e.g., 'npm list', 'git pull')
     * @returns {Promise<string>} - The stdout of the command
     */
    async execute(command) {
        return new Promise((resolve, reject) => {
            // Sanitize common dangerous characters to prevent trivial injection if exposed
            // (Note: This is an internal admin tool, but basic safety is good)
            if (command.includes('rm -rf /') || command.includes(':(){:|:&};:')) {
                return reject(new Error('Command blocked by safety protocol.'));
            }

            const fullCommand = `${this.baseEnv} && ${command}`;
            console.log(`[Terminal] Executing: ${command}`);

            exec(fullCommand, { shell: '/bin/bash' }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`[Terminal] Error: ${error.message}`);
                    return reject({ message: error.message, stderr: stderr || error.message });
                }
                if (stderr) {
                    console.warn(`[Terminal] Stderr: ${stderr}`);
                }
                resolve(stdout);
            });
        });
    }

    /**
     * Check system health via terminal
     */
    async checkNodeVersion() {
        return this.execute('node -v');
    }

    async checkDiskSpace() {
        return this.execute('df -h .');
    }
}

module.exports = new TerminalService();
