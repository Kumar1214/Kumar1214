const express = require('express');
const router = express.Router();
const Review = require('./Review');
const { auth, requireRole } = require('../../shared/middleware/auth');
const User = require('../identity/User');

// Mock AI Check Function
const checkContentSafety = async (text) => {
    // Simulate AI Latency
    await new Promise(r => setTimeout(r, 500));

    const badWords = ['spam', 'fake', 'hate', 'stupid', 'bad'];
    const isUnsafe = badWords.some(word => text.toLowerCase().includes(word));

    return {
        safe: !isUnsafe,
        confidence: isUnsafe ? 0.95 : 0.99,
        reason: isUnsafe ? "Detected potentially offensive keywords." : "Content appears safe."
    };
};

// GET All Reviews (Admin)
router.get('/', auth, requireRole('Admin'), async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [{ model: User, attributes: ['name', 'photoURL'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST Review (Auto-Moderated)
router.post('/', auth, async (req, res) => {
    try {
        const { rating, comment, targetType, targetId } = req.body;

        // 1. Run AI Check
        const aiResult = await checkContentSafety(comment);

        // 2. Determine Status
        let status = 'pending';
        let aiFlagged = false;

        if (aiResult.safe) {
            status = 'approved'; // Auto-Approve safe content
        } else {
            status = 'pending'; // Flag unsafe for manual review
            aiFlagged = true;
        }

        const review = await Review.create({
            userId: req.user.id,
            rating,
            comment,
            targetType,
            targetId,
            status,
            aiFlagged,
            aiConfidence: aiResult.confidence,
            aiReason: aiResult.reason
        });

        res.status(201).json({ success: true, data: review, aiResult });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// MODERATE Review (Admin)
router.put('/:id/status', auth, requireRole('Admin'), async (req, res) => {
    try {
        const { status } = req.body;
        await Review.update({ status }, { where: { id: req.params.id } });
        res.json({ success: true, message: "Review updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
