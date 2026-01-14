const express = require('express');
const router = express.Router();
const {
    getPodcasts,
    getPodcastById,
    createPodcast,
    updatePodcast,
    deletePodcast
} = require('./podcast.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

router.route('/')
    .get(getPodcasts)
    .post(protect, authorize('artist', 'admin'), createPodcast);

router.route('/:id')
    .get(getPodcastById)
    .put(protect, authorize('artist', 'admin'), updatePodcast)
    .delete(protect, authorize('artist', 'admin'), deletePodcast);

module.exports = router;
