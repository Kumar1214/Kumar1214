const Knowledgebase = require('./Knowledgebase');

// @desc    Get all knowledgebase articles
// @route   GET /api/v1/content/knowledgebase
// @access  Public
exports.getArticles = async (req, res) => {
    try {
        const where = {};
        if (req.query.category && req.query.category !== 'all') {
            where.category = req.query.category;
        }
        if (req.query.authorId) {
            where.authorId = req.query.authorId;
        }

        // Status security logic
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

        const articles = await Knowledgebase.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, count: articles.length, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single knowledgebase article
// @route   GET /api/v1/content/knowledgebase/:id
// @access  Public
exports.getArticleById = async (req, res) => {
    try {
        const article = await Knowledgebase.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new knowledgebase article
// @route   POST /api/v1/content/knowledgebase
// @access  Private (Admin/Instructor)
exports.createArticle = async (req, res) => {
    try {
        const articleData = {
            ...req.body,
            author: req.user.name,
            authorId: req.user.id
        };

        const article = await Knowledgebase.create(articleData);
        res.status(201).json({ success: true, data: article });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update knowledgebase article
// @route   PUT /api/v1/content/knowledgebase/:id
// @access  Private (Admin/Instructor)
exports.updateArticle = async (req, res) => {
    try {
        let article = await Knowledgebase.findByPk(req.params.id);
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

// @desc    Delete knowledgebase article
// @route   DELETE /api/v1/content/knowledgebase/:id
// @access  Private (Admin)
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Knowledgebase.findByPk(req.params.id);
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
