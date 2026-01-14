const express = require('express');
const router = express.Router();
const {
  getEntertainmentStats,
  getArtistMusic,
  getArtistPodcasts,
  getArtistMeditation
} = require('./entertainment.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

// All routes require authentication and artist authorization
router.use(protect);
router.use(authorize('artist'));

// Dashboard routes
router.get('/dashboard/stats', getEntertainmentStats);

// Content routes
router.get('/music', getArtistMusic);
router.get('/podcasts', getArtistPodcasts);
router.get('/meditation', getArtistMeditation);

module.exports = router;