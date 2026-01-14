const express = require('express');
const router = express.Router();
const MusicGenre = require('./MusicGenre');

// @route   GET /api/music-genres
// @desc    Get all music genres
// @access  Public
router.get('/', async (req, res) => {
    try {
        const genres = await MusicGenre.findAll({
            where: { status: 'active' },
            order: [['name', 'ASC']]
        });
        res.json({ success: true, data: genres });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/music-genres
// @desc    Create a music genre
// @access  Private (Admin)
router.post('/', async (req, res) => {
    try {
        const genre = await MusicGenre.create(req.body);
        res.status(201).json({ success: true, data: genre });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/music-genres/:id
// @desc    Update a music genre
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
    try {
        const genre = await MusicGenre.findByPk(req.params.id);
        if (!genre) return res.status(404).json({ success: false, message: 'Genre not found' });

        await genre.update(req.body);
        res.json({ success: true, data: genre });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/music-genres/:id
// @desc    Delete a music genre
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const genre = await MusicGenre.findByPk(req.params.id);
        if (!genre) return res.status(404).json({ success: false, message: 'Genre not found' });

        await genre.destroy();
        res.json({ success: true, message: 'Genre deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
