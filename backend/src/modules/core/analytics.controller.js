const { News, Knowledgebase } = require('../content');
const { Music, Podcast, Meditation } = require('../entertainment');
const { Course, Exam, Quiz } = require('../learning');
const Product = require('../marketplace/Product');
const { Op } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const models = {
    news: News,
    knowledgebase: Knowledgebase,
    music: Music,
    podcast: Podcast,
    meditation: Meditation,
    course: Course,
    exam: Exam,
    quiz: Quiz,
    product: Product
};

// @desc    Increment analytics counter
const trackEngagement = async (req, res) => {
    try {
        const { module, id, action } = req.params; // action: view, share, bookmark, play, etc.
        const Model = models[module.toLowerCase()];

        if (!Model) {
            return res.status(400).json({ success: false, message: 'Invalid module' });
        }

        const item = await Model.findByPk(id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        // Map actions to fields
        const actionToField = {
            'view': 'views',
            'share': 'shares',
            'bookmark': 'bookmarks',
            'play': 'playCount',
            'listen': 'playCount',
            'download': 'downloads',
            'like': 'likes',
            'enroll': 'students',
            'complete': 'completions'
        };

        const field = actionToField[action.toLowerCase()];
        if (field && item[field] !== undefined) {
            await item.increment(field);
        }

        // Track user-specific actions if authenticated
        if (req.user && (action === 'bookmark' || action === 'like')) {
            let userArrayField = action === 'bookmark' ? 'bookmarkedBy' : 'likedBy';
            if (item[userArrayField]) {
                let list = item[userArrayField] || [];
                if (!list.includes(req.user.id)) {
                    list.push(req.user.id);
                    await item.update({ [userArrayField]: list });
                }
            }
        }

        // Track share history
        if (action === 'share' && req.body.platform) {
            let history = item.shareHistory || [];
            history.push({
                userId: req.user ? req.user.id : null,
                platform: req.body.platform,
                timestamp: new Date()
            });
            await item.update({ shareHistory: history });
        }

        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get analytics overview for a module
const getModuleAnalytics = async (req, res) => {
    try {
        const { module } = req.params;
        const Model = models[module.toLowerCase()];

        if (!Model) {
            return res.status(400).json({ success: false, message: 'Invalid module' });
        }

        const totalItems = await Model.count();

        // Sum fields - depends on module
        const stats = await Model.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('views')), 'totalViews'],
                [sequelize.fn('SUM', sequelize.col('shares')), 'totalShares'],
                [sequelize.fn('SUM', sequelize.col('bookmarks')), 'totalBookmarks']
            ],
            raw: true
        });

        // Add module specific stats
        const extraStats = {};
        if (module === 'music' || module === 'podcast' || module === 'meditation') {
            const plays = await Model.sum('playCount');
            extraStats.totalPlays = plays || 0;
        } else if (module === 'course') {
            const enrollments = await Model.sum('students');
            extraStats.totalEnrollments = enrollments || 0;
            const revenue = await Model.sum('revenue');
            extraStats.totalRevenue = revenue || 0;
        } else if (module === 'product') {
            const sales = await Model.sum('soldCount');
            extraStats.totalSales = sales || 0;
            const revenue = await Model.sum('revenue');
            extraStats.totalRevenue = revenue || 0;
        }

        res.json({
            success: true,
            data: {
                totalItems,
                overview: stats[0],
                ...extraStats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get trending/top content
const getTrendingContent = async (req, res) => {
    try {
        const { module } = req.params;
        const { limit = 10 } = req.query;
        const Model = models[module.toLowerCase()];

        if (!Model) {
            return res.status(400).json({ success: false, message: 'Invalid module' });
        }

        // Logic: Rank by views (or customized score in future)
        const items = await Model.findAll({
            order: [['views', 'DESC']],
            limit: parseInt(limit)
        });

        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    trackEngagement,
    getModuleAnalytics,
    getTrendingContent
};
