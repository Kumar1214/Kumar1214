const express = require('express');
const router = express.Router();
const PodcastSeries = require('./PodcastSeries');

// @route   GET /api/podcast-series
// @desc    Get all podcast series
// @access  Public
router.get('/', async (req, res) => {
    try {
        const series = await PodcastSeries.findAll({
            where: { status: 'active' },
            order: [['name', 'ASC']]
        });
        res.json({ success: true, data: series });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/podcast-series
// @desc    Create a podcast series
// @access  Private (Admin)
router.post('/', async (req, res) => {
    try {
        const series = await PodcastSeries.create(req.body);
        res.status(201).json({ success: true, data: series });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/podcast-series/:id
// @desc    Update a podcast series
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
    try {
        const series = await PodcastSeries.findByPk(req.params.id);
        if (!series) return res.status(404).json({ success: false, message: 'Series not found' });

        await series.update(req.body);
        res.json({ success: true, data: series });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/podcast-series/:id
// @desc    Delete a podcast series
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const series = await PodcastSeries.findByPk(req.params.id);
        if (!series) return res.status(404).json({ success: false, message: 'Series not found' });

        await series.destroy();
        res.json({ success: true, message: 'Series deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
