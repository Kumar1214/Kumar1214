const { exec } = require('node:child_process');
const path = require('node:path');

/**
 * TerminalService
 * Provides a bridge for the "Autonomous AI" to execute system commands.
 * CRITICAL: This grants partial shell access.
 */
class TerminalService {
    // Base command to ensure we are in the correct environment
    baseEnv = 'source /home/gaugyanc/nodevenv/gaugyan-api/20/bin/activate && cd /home/gaugyanc/gaugyan-api';

    /**
     * Execute a shell command within the application environment
     * @param {string} command - The command to run (e.g., 'npm list', 'git pull')
     * @returns {Promise<string>} - The stdout of the command
     */
    async execute(command) {
        return new Promise((resolve, reject) => {
            // STRICT SECURITY PROTOCOL: White-list only specific maintenance commands
            // Arbitrary execution is blocked.
            const ALLOWED_COMMANDS = [
                /^node -v$/,
                /^npm list$/,
                /^git status$/,
                /^git log -n \d+$/,
                /^df -h \.$/,
                /^whoami$/,
                /^npm run build$/
            ];

            const isAllowed = ALLOWED_COMMANDS.some(pattern => pattern.test(command.trim()));

            if (!isAllowed) {
                console.warn(`[Terminal] SECURITY ALERT: Blocked unauthorized command execution: "${command}"`);
                return reject(new Error('Security Block: Command not authorized for execution.'));
            }

            const fullCommand = `${this.baseEnv} && ${command}`;
            console.log(`[Terminal] Executing: ${command}`);

            exec(fullCommand, { shell: '/bin/bash' }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`[Terminal] Error: ${error.message}`);
                    return reject(new Error(`${error.message}: ${stderr || error.message}`));
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
