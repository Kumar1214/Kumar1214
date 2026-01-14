const express = require('express');
const router = express.Router();
const MusicMood = require('./MusicMood');

// @route   GET /api/music-moods
// @desc    Get all music moods
// @access  Public
router.get('/', async (req, res) => {
    try {
        const moods = await MusicMood.findAll({
            where: { status: 'active' },
            order: [['name', 'ASC']]
        });
        res.json({ success: true, data: moods });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/music-moods
// @desc    Create a music mood
// @access  Private (Admin)
router.post('/', async (req, res) => {
    try {
        const mood = await MusicMood.create(req.body);
        res.status(201).json({ success: true, data: mood });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/music-moods/:id
// @desc    Update a music mood
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
    try {
        const mood = await MusicMood.findByPk(req.params.id);
        if (!mood) return res.status(404).json({ success: false, message: 'Mood not found' });

        await mood.update(req.body);
        res.json({ success: true, data: mood });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/music-moods/:id
// @desc    Delete a music mood
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const mood = await MusicMood.findByPk(req.params.id);
        if (!mood) return res.status(404).json({ success: false, message: 'Mood not found' });

        await mood.destroy();
        res.json({ success: true, message: 'Mood deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
