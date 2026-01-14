const News = require('./News');
const { Op } = require('sequelize');

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const where = {};
        if (req.query.category && req.query.category !== 'all') where.category = req.query.category;
        if (req.query.authorId) where.authorId = req.query.authorId;

        // Status security
        if (req.query.status && req.query.status !== 'all') {
            where.status = req.query.status;
        } else {
            // Default visibility
            const requestingOwn = req.user && req.query.authorId && String(req.query.authorId) === String(req.user.id);
            const isAdmin = req.user && req.user.role === 'admin';

            if (!isAdmin && !requestingOwn) {
                where.status = 'published';
            }
        }

        const { count, rows } = await News.findAndCountAll({
            where,
            offset: startIndex,
            limit: limit,
            order: [['createdAt', 'DESC']]
        });

        const pagination = {};

        if (startIndex + limit < count) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({ success: true, count: rows.length, total: count, pagination, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single news article
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = async (req, res) => {
    try {
        const article = await News.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new news article
// @route   POST /api/news
// @access  Private (Admin/Editor)
exports.createNews = async (req, res) => {
    try {
        const articleData = {
            ...req.body,
            author: req.user.name,
            authorId: req.user.id
        };

        const article = await News.create(articleData);
        res.status(201).json({ success: true, data: article });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private (Admin/Editor)
exports.updateNews = async (req, res) => {
    try {
        let article = await News.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        // Check ownership - only author or admin can update
        if (req.user.role !== 'admin' && String(article.authorId) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this article' });
        }

        article = await article.update(req.body);

        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private (Admin)
exports.deleteNews = async (req, res) => {
    try {
        const article = await News.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        // Only admin can delete articles
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this article' });
        }

        await article.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
