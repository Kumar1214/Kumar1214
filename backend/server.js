const fs = require('fs');
const path = require('path');

// DEBUG LOGGING SETUP
const logFile = path.join(__dirname, 'server_debug.log');
const log = (message) => {
    const timestamp = new Date().toISOString();
    const msg = `[${timestamp}] ${message}\n`;
    try {
        console.log(message);
    } catch (e) {
        // EPIPE or other console errors should not crash the app
    }
    try {
        fs.appendFileSync(logFile, msg);
    } catch {
        // failed to write log
    }
};

// Initialize app variable for export
let app;

// Catch init errors
try {
    log('--- Server Startup Initiated [FORCE RESTART CHECK - V2.1 FIXED] ---');
    log(`Node Version: ${process.version}`);
    log(`Environment: ${process.env.NODE_ENV}`);
    const express = require('express');
    const dotenv = require('dotenv');
    const cors = require('cors');
    const helmet = require('helmet');
    const { connectDB } = require('./src/shared/config/database');
    const { sanitizeData } = require('./src/shared/middleware/security');
    const logger = require('./src/shared/middleware/logger');
    const errorHandler = require('./src/shared/middleware/errorHandler');

    // Load env vars
    dotenv.config();
    log('Environment variables loaded');

    // Initialize Express App
    app = express();

    // Connect to database
    const startServer = async () => {
        try {
            log('Initializing DB Connection...');
            connectDB();
            log('Database connection initiated');
        } catch (err) {
            log(`CRITICAL: Database connection failed: ${err.message}`);
            log(err.stack);
        }
    };

    // Logger Middleware
    app.use(logger);

    // Security Middleware
    app.set('trust proxy', true); // Trust all proxies (needed for cPanel/Passenger)
    app.use(helmet());
    app.use(express.json({ limit: '10mb' }));
    app.use(...sanitizeData());

    // Initialize Cron Jobs
    const startNewsCron = require('./src/shared/services/cron');
    startNewsCron();

    // CORS setup
    const clientUrl = process.env.CLIENT_URL || '*';
    const allowedOrigins = clientUrl.includes(',')
        ? clientUrl.split(',').map(url => url.trim())
        : [clientUrl.trim()];

    // FIX: Force production URLs to be allowed
    const validOrigins = [
        ...allowedOrigins,
        'https://gaugyanworld.org',
        'https://www.gaugyanworld.org',
        'https://api.gaugyanworld.org'
    ];
    // Remove duplicates
    const uniqueOrigins = [...new Set(validOrigins)];

    console.log('Allowed Origins (Fixed):', uniqueOrigins);

    app.use(cors({
        origin: uniqueOrigins,
        credentials: true
    }));

    // Routes
    app.use('/api/shipping', require('./src/modules/marketplace/shipping.routes'));
    app.use('/api/messages', require('./src/modules/communication/message.routes'));

    app.use((req, res, next) => {
        req.setTimeout(20000);
        next();
    });

    app.get('/', (req, res) => res.send('API is running...'));
    app.get('/api', (req, res) => res.status(200).json({ status: 'ok' }));
    app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
    app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

    // DB Health
    app.get('/api/health/db', async (req, res) => {
        try {
            const { sequelize } = require('./src/shared/config/database');
            await sequelize.authenticate();
            res.status(200).json({ status: 'ok', database: 'connected' });
        } catch (error) {
            res.status(503).json({ error: error.message });
        }
    });

    // Serve static files
    const uploadPath = process.env.FILE_UPLOAD_PATH || './uploads';
    app.use('/uploads', express.static(uploadPath));
    if (uploadPath !== './public/uploads') {
        app.use('/uploads', express.static('./public/uploads'));
    }
    if (uploadPath !== './uploads') {
        app.use('/uploads', express.static('./uploads'));
    }

    // Serve public directory
    app.use(express.static('public'));

    // Load Routes
    try {
        const PluginManager = require('./src/shared/services/PluginManager');
        const { sequelize } = require('./src/shared/config/database');

        // ... Plugin Manager init wrapped in initApp ...

        app.use('/api/notifications', require('./src/modules/notifications/notification.routes'));
        app.use('/api/storage', require('./src/modules/content/storage.routes'));
        app.use('/api/media', require('./src/modules/content/media.routes'));
        app.use('/api/community', require('./src/modules/content/community.routes'));
        app.use('/api/pages', require('./src/modules/content/pages.routes'));
        app.use('/api/banners', require('./src/modules/content/banners.routes'));
        app.use('/api/news', require('./src/modules/content/news.routes'));
        app.use('/api/v1/content/knowledgebase', require('./src/modules/content/knowledgebase.routes'));
        app.use('/api/products', require('./src/modules/marketplace/products.routes'));
        app.use('/api/marketplace/categories', require('./src/modules/marketplace/categories.routes'));
        app.use('/api/orders', require('./src/modules/marketplace/orders.routes'));
        app.use('/api/finance', require('./src/modules/marketplace/finance.routes'));
        app.use('/api/cart', require('./src/modules/marketplace/cart.routes'));
        app.use('/api/music', require('./src/modules/entertainment/music.routes'));
        app.use('/api/podcasts', require('./src/modules/entertainment/podcasts.routes'));
        app.use('/api/meditation', require('./src/modules/entertainment/meditation.routes'));
        app.use('/api/entertainment', require('./src/modules/entertainment/entertainment.routes'));
        app.use('/api/courses', require('./src/modules/learning/courses.routes'));
        app.use('/api/astrology', require('./src/modules/entertainment/astrology.routes'));
        app.use('/api/exams', require('./src/modules/learning/exams.routes'));
        app.use('/api/quizzes', require('./src/modules/learning/quizzes.routes'));
        app.use('/api/users', require('./src/modules/identity/users.routes'));
        app.use('/api/roles', require('./src/modules/identity/role.routes'));
        app.use('/api/v1/auth', require('./src/modules/identity/auth.routes'));
        app.use('/api/v1/wallet', require('./src/modules/identity/wallet.routes'));
        app.use('/api/v1/certificate', require('./src/modules/identity/certificate.routes'));
        app.use('/api/questions', require('./src/modules/learning/questions.routes'));
        app.use('/api/question-banks', require('./src/modules/learning/questionBanks.routes'));
        app.use('/api/analytics', require('./src/modules/core/analytics.routes'));
        app.use('/api/course-categories', require('./src/modules/learning/courseCategories.routes'));
        app.use('/api/education/meetings', require('./src/modules/learning/meetings.routes'));

        // CLEANED ROUTES (Duplicates Removed)
        app.use('/api/gaushalas', require('./src/modules/marketplace/gaushalas.routes'));
        app.use('/api/cows', require('./src/modules/marketplace/cows.routes'));
        app.use('/api/contact', require('./src/modules/marketplace/contact.routes'));
        app.use('/api/coupons', require('./src/modules/marketplace/coupon.routes'));
        app.use('/api/ai', require('./src/modules/core/ai.routes'));
        app.use('/api/reviews', require('./src/modules/marketplace/review.routes'));
        app.use('/api/verification', require('./src/modules/identity/verification.routes'));
        app.use('/api/admin', require('./src/modules/admin/admin.routes'));

        // Helpers
        app.use('/api/music-genres', require('./src/modules/entertainment/musicGenres.routes'));
        app.use('/api/music-albums', require('./src/modules/entertainment/musicAlbums.routes'));
        app.use('/api/music-moods', require('./src/modules/entertainment/musicMoods.routes'));
        app.use('/api/podcast-categories', require('./src/modules/entertainment/podcastCategories.routes'));
        app.use('/api/podcast-series', require('./src/modules/entertainment/podcastSeries.routes'));
        app.use('/api/meditation-categories', require('./src/modules/entertainment/meditationCategories.routes'));

        // Content Categories
        app.use('/api/news-categories', require('./src/modules/content/newsCategories.routes'));
        app.use('/api/knowledgebase-categories', require('./src/modules/content/knowledgebaseCategories.routes'));

        app.use('/api/feedback', require('./src/modules/communication/feedback.routes'));

        // Settings & Communication
        app.use('/api/v1/email-templates', require('./src/modules/core/email-template.routes'));
        app.use('/api/settings', require('./src/modules/core/settings.routes'));
        app.use('/api/health', require('./src/modules/core/health.routes'));

        log('Routes loaded successfully');
    } catch (err) {
        log(`CRITICAL: Error loading routes: ${err.message}`);
        log(err.stack);
    }

    // Plugin Placeholder Router
    const pluginRouter = express.Router();
    app.use('/api', pluginRouter);

    app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
    app.use(errorHandler);

    // Start Server Logic
    const initApp = async () => {
        await startServer();

        // Initialize Plugins (Async)
        try {
            log('Starting Plugin Manager Initialization...');
            const PluginManager = require('./src/shared/services/PluginManager');
            const { sequelize } = require('./src/shared/config/database');
            const pluginManager = new PluginManager(app, sequelize);
            log('PluginManager instance created.');

            // System endpoint: List all plugins
            pluginRouter.get('/system/plugins', (req, res) => {
                log('GET /system/plugins called');
                try {
                    res.json({ success: true, data: pluginManager.getAllPlugins() });
                } catch (e) {
                    res.status(500).json({ success: false, message: e.message });
                }
            });
            log('Registered GET /system/plugins');

            // System endpoint: Toggle plugin
            pluginRouter.put('/system/plugins/:slug/toggle', async (req, res) => {
                try {
                    const { active } = req.body;
                    const plugin = await pluginManager.togglePlugin(req.params.slug, active);
                    res.json({ success: true, data: plugin });
                } catch (err) {
                    res.status(500).json({ success: false, message: err.message });
                }
            });
            log('Registered PUT /system/plugins/:slug/toggle');

            const pluginRoutes = await pluginManager.initialize();

            // Mount routes dynamically
            pluginRouter.use(pluginRoutes);
            log('Plugin Routes Mounted Successfully to Placeholder.');

        } catch (err) {
            log(`Plugin System Error: ${err.message}`);
            log(err.stack);
        }

        // Initialize Notification Service on Startup
        try {
            const notificationService = require('./src/modules/notifications/NotificationService');
            // Notify admins that the "Autonomous AI" backend is online
            await notificationService.notifyAdmins(
                'System Online',
                'GauGyan AI Backend (Autonomous v1) has started successfully.',
                'success'
            );
            log('Startup notification sent to admins.');
        } catch (noteErr) {
            log(`Notification Init Error: ${noteErr.message}`);
        }

        const PORT = process.env.PORT || 5001;
        log(`Attempting to listen on port ${PORT}...`);

        const _server = app.listen(PORT, () => {
            log(`Server listening on port ${PORT}. Ready to accept connections.`);
        });
    };

    initApp();

    process.on('unhandledRejection', (err) => {
        log(`Unhandled Rejection: ${err.message}`);
        log(err.stack);
    });

    process.on('uncaughtException', (err) => {
        log(`Uncaught Exception: ${err.message}`);
        log(err.stack);
    });

} catch (e) {
    if (log) {
        log(`Startup Crash: ${e.message}`);
        log(e.stack);
    } else {
        console.error(e);
    }
}

module.exports = app;
