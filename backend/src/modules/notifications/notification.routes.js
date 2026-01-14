const express = require('express');
const router = express.Router();
const Notification = require('./Notification');
const { protect: auth } = require('../../shared/middleware/protect'); // Use updated middleware

// @route   GET /api/notifications
// @desc    Get all notifications for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { recipient: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 50
        });

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.get('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Check ownership
        if (notification.recipient !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await notification.update({ read: true });

        res.json({ success: true, data: notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
    try {
        await Notification.update(
            { read: true },
            { where: { recipient: req.user.id, read: false } }
        );
        res.json({ success: true, message: 'All marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
