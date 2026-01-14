const express = require('express');
const router = express.Router();
const PodcastCategory = require('./PodcastCategory');

// @route   GET /api/podcast-categories
// @desc    Get all podcast categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await PodcastCategory.findAll({
            where: { status: 'active' },
            order: [['name', 'ASC']]
        });
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/podcast-categories
// @desc    Create a podcast category
// @access  Private (Admin)
router.post('/', async (req, res) => {
    try {
        const category = await PodcastCategory.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/podcast-categories/:id
// @desc    Update a podcast category
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
    try {
        const category = await PodcastCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        await category.update(req.body);
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/podcast-categories/:id
// @desc    Delete a podcast category
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const category = await PodcastCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        await category.destroy();
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
