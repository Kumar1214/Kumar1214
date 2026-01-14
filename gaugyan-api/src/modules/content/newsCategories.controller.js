const NewsCategory = require('./NewsCategory');

// @desc    Get all news categories
// @route   GET /api/news-categories
// @access  Public
exports.getNewsCategories = async (req, res, next) => {
    try {
        const categories = await NewsCategory.findAll();
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single news category
// @route   GET /api/news-categories/:id
// @access  Public
exports.getNewsCategoryById = async (req, res, next) => {
    try {
        const category = await NewsCategory.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new news category
// @route   POST /api/news-categories
// @access  Private (Admin/Editor)
exports.createNewsCategory = async (req, res, next) => {
    try {
        const category = await NewsCategory.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
};

// @desc    Update news category
// @route   PUT /api/news-categories/:id
// @access  Private (Admin/Editor)
exports.updateNewsCategory = async (req, res, next) => {
    try {
        let category = await NewsCategory.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        category = await category.update(req.body);
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete news category
// @route   DELETE /api/news-categories/:id
// @access  Private (Admin)
exports.deleteNewsCategory = async (req, res, next) => {
    try {
        const category = await NewsCategory.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        await category.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
