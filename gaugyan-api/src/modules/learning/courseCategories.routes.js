const express = require('express');
const router = express.Router();
const CourseCategory = require('./CourseCategory');
const { protect, authorize } = require('../../shared/middleware/protect');

// @route   GET /api/course-categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await CourseCategory.findAll({ order: [['name', 'ASC']] });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/course-categories
// @desc    Add category
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const category = await CourseCategory.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/course-categories/:id
// @desc    Update category
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const category = await CourseCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        const updated = await category.update(req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/course-categories/:id
// @desc    Delete category
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const category = await CourseCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
