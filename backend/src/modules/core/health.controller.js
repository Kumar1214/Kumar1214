const { sequelize } = require('../../shared/config/database');
const os = require('os');

// @desc    Get System Health status
// @route   GET /api/health
// @access  Public
exports.getHealth = async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        system: {
            memoryUsage: process.memoryUsage(),
            osLoad: os.loadavg(),
            cpus: os.cpus().length
        }
    };

    try {
        await sequelize.authenticate();
        healthcheck.database = { status: 'connected', dialect: sequelize.getDialect() };
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = 'ERROR';
        healthcheck.database = { status: 'disconnected', error: error.message };
        res.status(503).send(healthcheck);
    }
};
