const express = require('express');
const router = express.Router();
const ProductCategory = require('./ProductCategory');
const { protect, authorize } = require('../../shared/middleware/protect');

// @route   GET /api/marketplace/categories
// @desc    Get all product categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await ProductCategory.findAll();
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/marketplace/categories
// @desc    Create category
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const category = await ProductCategory.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/marketplace/categories/:id
// @desc    Update category
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const category = await ProductCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await category.update(req.body);
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/marketplace/categories/:id
// @desc    Delete category
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const category = await ProductCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await category.destroy();
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
