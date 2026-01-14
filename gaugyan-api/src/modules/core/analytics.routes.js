const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

// PUBLIC ENDPOINTS
// @route   POST /api/analytics/:module/:id/:action
// @desc    Track engagement (view, play, etc.)
router.post('/:module/:id/:action', analyticsController.trackEngagement);

// @route   GET /api/analytics/:module/trending
// @desc    Get trending content
router.get('/:module/trending', analyticsController.getTrendingContent);

// PROTECTED ADMIN ENDPOINTS
// @route   GET /api/analytics/:module/overview
// @desc    Get module analytics overview
router.get('/:module/overview', protect, authorize('admin', 'instructor'), analyticsController.getModuleAnalytics);

module.exports = router;
