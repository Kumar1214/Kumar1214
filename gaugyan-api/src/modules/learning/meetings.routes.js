const express = require('express');
const router = express.Router();
const { getMeetings, createMeeting, updateMeeting, deleteMeeting } = require('./meeting.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

router.use(protect);
router.use(authorize('admin', 'instructor'));

router.route('/')
    .get(getMeetings)
    .post(createMeeting);

router.route('/:id')
    .put(updateMeeting)
    .delete(deleteMeeting);

module.exports = router;
