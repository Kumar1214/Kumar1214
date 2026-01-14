const express = require('express');
const router = express.Router();
const {
    getMusic,
    getMusicById,
    createMusic,
    updateMusic,
    deleteMusic
} = require('./music.controller');
const { protect, authorize, optionalAuth } = require('../../shared/middleware/protect');

router.route('/')
    .get(optionalAuth, getMusic)
    .post(protect, authorize('artist', 'admin'), createMusic);

router.route('/:id')
    .get(getMusicById)
    .put(protect, authorize('artist', 'admin'), updateMusic)
    .delete(protect, authorize('artist', 'admin'), deleteMusic);

module.exports = router;
