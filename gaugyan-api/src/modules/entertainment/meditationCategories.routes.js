const express = require('express');
const router = express.Router();
const MeditationCategory = require('./MeditationCategory');

// @route   GET /api/meditation-categories
// @desc    Get all meditation categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await MeditationCategory.findAll({
            where: { status: 'active' },
            order: [['name', 'ASC']]
        });
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/meditation-categories
// @desc    Create a meditation category
// @access  Private (Admin)
router.post('/', async (req, res) => {
    try {
        const category = await MeditationCategory.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/meditation-categories/:id
// @desc    Update a meditation category
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
    try {
        const category = await MeditationCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        await category.update(req.body);
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/meditation-categories/:id
// @desc    Delete a meditation category
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const category = await MeditationCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        await category.destroy();
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
