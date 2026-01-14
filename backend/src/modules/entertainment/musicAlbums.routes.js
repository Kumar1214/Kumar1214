const express = require('express');
const router = express.Router();
const MusicAlbum = require('./MusicAlbum');

// @route   GET /api/music-albums
// @desc    Get all music albums
// @access  Public
router.get('/', async (req, res) => {
    try {
        const albums = await MusicAlbum.findAll({
            where: { status: 'active' },
            order: [['name', 'ASC']]
        });
        res.json({ success: true, data: albums });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/music-albums
// @desc    Create a music album
// @access  Private (Admin)
router.post('/', async (req, res) => {
    try {
        const album = await MusicAlbum.create(req.body);
        res.status(201).json({ success: true, data: album });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/music-albums/:id
// @desc    Update a music album
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
    try {
        const album = await MusicAlbum.findByPk(req.params.id);
        if (!album) return res.status(404).json({ success: false, message: 'Album not found' });

        await album.update(req.body);
        res.json({ success: true, data: album });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/music-albums/:id
// @desc    Delete a music album
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const album = await MusicAlbum.findByPk(req.params.id);
        if (!album) return res.status(404).json({ success: false, message: 'Album not found' });

        await album.destroy();
        res.json({ success: true, message: 'Album deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
