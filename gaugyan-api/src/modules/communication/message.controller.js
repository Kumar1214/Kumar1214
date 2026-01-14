const asyncHandler = require('express-async-handler');
const Message = require('./Message');
const User = require('../identity/User');
const { Op } = require('sequelize');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, message, courseId } = req.body;

    if (!receiverId || !message) {
        res.status(400);
        throw new Error('Please provide receiver and message');
    }

    const newMessage = await Message.create({
        senderId: req.user.id,
        receiverId,
        message,
        courseId,
        isRead: false
    });

    res.status(201).json({ success: true, data: newMessage });
});

// @desc    Get my messages (received)
// @route   GET /api/messages/my-messages
// @access  Private
exports.getMyMessages = asyncHandler(async (req, res) => {
    const messages = await Message.findAll({
        where: {
            [Op.or]: [
                { receiverId: req.user.id },
                { senderId: req.user.id } // Optionally fetch sent ones too for chat history
            ]
        },
        include: [
            { model: User, as: 'sender', attributes: ['id', 'name', 'email', 'avatar'] },
            { model: User, as: 'receiver', attributes: ['id', 'name', 'email', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: messages });
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
    const message = await Message.findByPk(req.params.id);

    if (message) {
        if (message.receiverId !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized');
        }
        message.isRead = true;
        await message.save();
        res.json({ success: true, data: message });
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
});
