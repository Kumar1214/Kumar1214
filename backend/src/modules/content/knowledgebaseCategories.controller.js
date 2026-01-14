const KnowledgebaseCategory = require('./KnowledgebaseCategory');

// @desc    Get all knowledgebase categories
// @route   GET /api/knowledgebase-categories
// @access  Public
exports.getKnowledgebaseCategories = async (req, res, next) => {
    try {
        const categories = await KnowledgebaseCategory.findAll();
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single knowledgebase category
// @route   GET /api/knowledgebase-categories/:id
// @access  Public
exports.getKnowledgebaseCategoryById = async (req, res, next) => {
    try {
        const category = await KnowledgebaseCategory.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new knowledgebase category
// @route   POST /api/knowledgebase-categories
// @access  Private (Admin/Instructor)
exports.createKnowledgebaseCategory = async (req, res, next) => {
    try {
        const category = await KnowledgebaseCategory.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
};

// @desc    Update knowledgebase category
// @route   PUT /api/knowledgebase-categories/:id
// @access  Private (Admin/Instructor)
exports.updateKnowledgebaseCategory = async (req, res, next) => {
    try {
        let category = await KnowledgebaseCategory.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        category = await category.update(req.body);
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete knowledgebase category
// @route   DELETE /api/knowledgebase-categories/:id
// @access  Private (Admin)
exports.deleteKnowledgebaseCategory = async (req, res, next) => {
    try {
        const category = await KnowledgebaseCategory.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        await category.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
