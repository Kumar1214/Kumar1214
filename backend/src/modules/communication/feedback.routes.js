const express = require('express');
const router = express.Router();
const {
    createFeedback,
    getFeedbacks,
    updateFeedbackStatus,
    deleteFeedback
} = require('./feedback.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

// Public route to submit feedback
router.post('/', createFeedback);

// Admin routes
router.use(protect);
router.use(authorize('admin', 'editor'));

router.get('/', getFeedbacks);
router.route('/:id')
    .put(updateFeedbackStatus)
    .delete(deleteFeedback);

module.exports = router;
