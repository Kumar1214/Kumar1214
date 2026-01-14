const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../shared/middleware/protect');
const Astrologer = require('../identity/Astrologer');
const User = require('../identity/User');
const Appointment = require('../marketplace/Appointment');
const panchangService = require('../content/services/panchangService');
const { Op } = require('sequelize');

// Public: Get Daily Panchang
router.get('/panchang/today', async (req, res) => {
    try {
        const { date = new Date(), lat = 28.6139, lon = 77.2090 } = req.query; // Default to Delhi
        const data = await panchangService.getDailyPanchang(date, lat, lon);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Public: List Astrologers
router.get('/astrologers', async (req, res) => {
    try {
        const { specialization } = req.query;
        // In real app, filter JSON array
        const where = {};

        const astrologers = await Astrologer.findAll({
            include: [{
                model: User,
                attributes: ['name', 'profilePicture', 'id']
            }],
            where
        });

        res.json({ success: true, data: astrologers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Protected: Get My Astrologer Profile (For Astrologers)
router.get('/astrologers/me', protect, authorize('astrologer'), async (req, res) => {
    try {
        const profile = await Astrologer.findOne({ where: { userId: req.user.id } });
        res.json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Protected: Create/Update Astrologer Profile
router.put('/astrologers/me', protect, authorize('astrologer'), async (req, res) => {
    try {
        const { bio, specialization, experience, consultationFee, languages } = req.body;

        let profile = await Astrologer.findOne({ where: { userId: req.user.id } });

        if (profile) {
            profile = await profile.update({ bio, specialization, experience, consultationFee, languages });
        } else {
            profile = await Astrologer.create({
                userId: req.user.id,
                bio, specialization, experience, consultationFee, languages
            });
        }

        res.json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Protected: Book Appointment
router.post('/appointments', protect, async (req, res) => {
    try {
        const { astrologerId, slotTime, notes } = req.body;

        const appointment = await Appointment.create({
            userId: req.user.id,
            astrologerId,
            slotTime,
            notes,
            status: 'scheduled'
        });

        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
