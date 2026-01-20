const fs = require('fs');
const path = require('path');
const logger = require('./src/shared/config/logger');

// Initialize app variable for export
let app;

// Catch init errors
try {
    logger.info('--- Server Startup Initiated [FORCE RESTART CHECK - V2.2 FIXED] ---');
    logger.info(`Node Version: ${process.version}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);

    const express = require('express');
    const dotenv = require('dotenv');
    const cors = require('cors');
    const helmet = require('helmet');
    const { connectDB } = require('./src/shared/config/database');
    const { sanitizeData } = require('./src/shared/middleware/security');
    const requestLogger = require('./src/shared/middleware/logger'); // Renamed to avoid conflict
    const errorHandler = require('./src/shared/middleware/errorHandler');

    // Load env vars
    dotenv.config();
    logger.info('Environment variables loaded');

    // Initialize Express App
    app = express();

    // Connect to database
    const startServer = async () => {
        try {
            logger.info('Initializing DB Connection...');
            connectDB();
            logger.info('Database connection initiated');
        } catch (err) {
            logger.error(`CRITICAL: Database connection failed: ${err.message}`);
            logger.error(err.stack);
        }
    };

    // Logger Middleware (Morgan/Request Logger)
    if (requestLogger) {
        app.use(requestLogger);
    }

    // Security Middleware
    app.set('trust proxy', true); // Trust all proxies (needed for cPanel/Passenger)
    app.use(helmet());
    app.use(express.json({ limit: '10mb' }));
    app.use(...sanitizeData());

    // Initialize Cron Jobs
    try {
        const startNewsCron = require('./src/shared/services/cron');
        startNewsCron();
    } catch (cronErr) {
        logger.error(`Cron Job Init Warning: ${cronErr.message}`);
    }

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
        'https://api.gaugyanworld.org',
        // Localhost for development
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5001'
    ];
    // Remove duplicates
    const uniqueOrigins = [...new Set(validOrigins)];

    logger.info(`Allowed Origins (Fixed): ${JSON.stringify(uniqueOrigins)}`);

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
    try {
        app.use('/uploads', express.static(uploadPath));
        if (uploadPath !== './public/uploads') {
            app.use('/uploads', express.static('./public/uploads'));
        }
        if (uploadPath !== './uploads') {
            app.use('/uploads', express.static('./uploads'));
        }
    } catch (staticErr) {
        logger.warn(`Static file serving warning: ${staticErr.message}`);
    }

    // Serve public directory
    app.use(express.static('public'));

    // Load Routes
    try {
        // Plugin Manager init kept in initApp for proper loading sequence

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

        logger.info('Routes loaded successfully');
    } catch (err) {
        logger.error(`CRITICAL: Error loading routes: ${err.message}`);
        logger.error(err.stack);
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
            logger.info('Starting Plugin Manager Initialization...');
            const PluginManager = require('./src/shared/services/PluginManager');
            const { sequelize } = require('./src/shared/config/database');
            const pluginManager = new PluginManager(app, sequelize);
            logger.info('PluginManager instance created.');

            // System endpoint: List all plugins
            pluginRouter.get('/system/plugins', (req, res) => {
                logger.info('GET /system/plugins called');
                try {
                    res.json({ success: true, data: pluginManager.getAllPlugins() });
                } catch (e) {
                    res.status(500).json({ success: false, message: e.message });
                }
            });
            logger.info('Registered GET /system/plugins');

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
            logger.info('Registered PUT /system/plugins/:slug/toggle');

            const pluginRoutes = await pluginManager.initialize();

            // Mount routes dynamically
            pluginRouter.use(pluginRoutes);
            logger.info('Plugin Routes Mounted Successfully to Placeholder.');

        } catch (err) {
            logger.error(`Plugin System Error: ${err.message}`);
            logger.error(err.stack);
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
            logger.info('Startup notification sent to admins.');
        } catch (noteErr) {
            logger.error(`Notification Init Error: ${noteErr.message}`);
        }

        const PORT = process.env.PORT || 5001;
        logger.info(`Attempting to listen on port ${PORT}...`);

        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server listening on port ${PORT}. Ready to accept connections.`);
        });
    };

    initApp();

    process.on('unhandledRejection', (err) => {
        logger.error(`Unhandled Rejection: ${err.message}`);
        logger.error(err.stack);
        // Do not crash, but log
    });

    process.on('uncaughtException', (err) => {
        logger.error(`Uncaught Exception: ${err.message}`);
        logger.error(err.stack);
        // Optional: process.exit(1) if necessary, but request was to keep it alive if possible or self-heal
    });

} catch (e) {
    if (logger) {
        logger.error(`Startup Crash: ${e.message}`);
        logger.error(e.stack);
    } else {
        console.error('Fatal startup error before logger init:', e);
    }
}

module.exports = app;
