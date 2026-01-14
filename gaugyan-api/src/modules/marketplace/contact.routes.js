const express = require('express');
const router = express.Router();
const ContactMessage = require('./ContactMessage');
// const auth = require('../../shared/middleware/auth'); 

// @route   POST /api/contact
// @desc    Submit a contact message
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        // AI Logic (Mock)
        const textStart = (subject + " " + message).toLowerCase();
        let aiTags = [];
        let aiPriority = 'medium';
        let aiSentiment = 'neutral';

        // Priority Check
        if (textStart.includes('urgent') || textStart.includes('emergency') || textStart.includes('failed') || textStart.includes('hack')) {
            aiPriority = 'high';
            aiTags.push('urgent');
        }

        // Category Tags
        if (textStart.includes('refund') || textStart.includes('money') || textStart.includes('payment')) aiTags.push('billing');
        if (textStart.includes('bug') || textStart.includes('error') || textStart.includes('login')) aiTags.push('tech_support');
        if (textStart.includes('course') || textStart.includes('content')) aiTags.push('content');

        // Sentiment Check
        if (textStart.includes('angry') || textStart.includes('bad') || textStart.includes('worst') || textStart.includes('scam')) {
            aiSentiment = 'negative';
        } else if (textStart.includes('love') || textStart.includes('great') || textStart.includes('thanks')) {
            aiSentiment = 'positive';
        }

        const newMessage = await ContactMessage.create({
            name,
            email,
            subject,
            message,
            aiTags,
            aiPriority,
            aiSentiment
        });

        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/contact
// @desc    Get all contact messages
// @access  Private (Admin)
router.get('/', async (req, res) => {
    try {
        const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a contact message
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const message = await ContactMessage.findByPk(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.destroy();

        res.json({ message: 'Message removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/contact/bulk-delete
// @desc    Delete multiple contact messages
// @access  Private (Admin)
router.post('/bulk-delete', async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No IDs provided' });
        }

        const { Op } = require('sequelize');
        await ContactMessage.destroy({
            where: {
                id: { [Op.in]: ids }
            }
        });

        res.json({ message: 'Messages deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/contact/:id/status
// @desc    Update message status
// @access  Private (Admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const message = await ContactMessage.findByPk(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.update({ status });

        res.json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
