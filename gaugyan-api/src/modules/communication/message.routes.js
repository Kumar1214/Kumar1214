const express = require('express');
const { sendMessage, getMyMessages, markAsRead } = require('./message.controller');
const { protect } = require('../../shared/middleware/protect');

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
    .post(sendMessage);

router.route('/my-messages')
    .get(getMyMessages);

router.route('/:id/read')
    .put(markAsRead);

module.exports = router;
