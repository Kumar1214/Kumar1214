
const SENTINEL_LOG_KEY = 'shunya_sentinel_logs';
const SENTINEL_STATS_KEY = 'shunya_sentinel_stats';

const SentinelService = {
    // Log a new system event or error
    logEvent: (type, message, details = null, source = 'frontend') => {
        const timestamp = new Date().toISOString();
        const newLog = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            type, // 'error', 'warning', 'info', 'success'
            message,
            details,
            source,
            timestamp,
            read: false
        };

        try {
            const logs = SentinelService.getLogs();
            logs.unshift(newLog); // Add to top
            // Keep only last 100 logs
            if (logs.length > 100) logs.length = 100;
            localStorage.setItem(SENTINEL_LOG_KEY, JSON.stringify(logs));

            // Update stats
            SentinelService.updateStats(type);

            return newLog;
        } catch (e) {
            console.error("Sentinel storage failed", e);
        }
    },

    // Get all logs
    getLogs: () => {
        try {
            const logs = localStorage.getItem(SENTINEL_LOG_KEY);
            return logs ? JSON.parse(logs) : [];
        } catch (e) {
            return [];
        }
    },

    // Clear logs
    clearLogs: () => {
        localStorage.removeItem(SENTINEL_LOG_KEY);
        // Reset stats partially maybe? No, keep stats.
    },

    // Get System Level Stats (Mocked + Real Local Data)
    getSystemStats: () => {
        const storedStats = localStorage.getItem(SENTINEL_STATS_KEY);
        const baseStats = storedStats ? JSON.parse(storedStats) : {
            errors: 0,
            warnings: 0,
            uptime_start: Date.now()
        };

        // Calculate simplified browser memory if available (limited accuracy)
        const memory = window.performance && window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

        return {
            ...baseStats,
            memory: memory,
            uptime: Math.floor((Date.now() - baseStats.uptime_start) / 1000), // in seconds
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screen: `${window.innerWidth}x${window.innerHeight}`
        };
    },

    updateStats: (type) => {
        const current = SentinelService.getSystemStats();
        if (type === 'error') current.errors = (current.errors || 0) + 1;
        if (type === 'warning') current.warnings = (current.warnings || 0) + 1;

        localStorage.setItem(SENTINEL_STATS_KEY, JSON.stringify({
            errors: current.errors,
            warnings: current.warnings,
            uptime_start: current.uptime_start
        }));
    },

    // Simulate "Self-Healing" or Analysis
    analyzeIssue: async (issueText) => {
        // Mock AI analysis delay
        await new Promise(r => setTimeout(r, 1500));

        const keywords = issueText.toLowerCase();
        if (keywords.includes('payment') || keywords.includes('money')) {
            return { action: "Finance Audit", result: "Checked simulated payment logs. No anomalies found locally.", status: "success" };
        }
        if (keywords.includes('login') || keywords.includes('auth')) {
            return { action: "Auth Debug", result: "Cleared local tokens to force refresh.", status: "warning", fix: () => localStorage.removeItem('token') };
        }
        if (keywords.includes('slow') || keywords.includes('loading')) {
            return { action: "Performance Opt", result: "Cleared localized cache.", status: "success", fix: () => window.location.reload() };
        }

        return { action: "General Analysis", result: "Logged issue for admin review. System seems stable.", status: "info" };
    }
};

export default SentinelService;
