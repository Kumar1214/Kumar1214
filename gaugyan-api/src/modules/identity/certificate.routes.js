const express = require('express');
const router = express.Router();
const Settings = require('../core/Settings');

// @desc    Get Certificate Details (Public Verification)
// @route   GET /api/v1/certificate/verify/:serialNumber
// @access  Public
router.get('/verify/:serialNumber', async (req, res) => {
    try {
        const { serialNumber } = req.params;

        // Mock validation logic
        if (!serialNumber) {
            return res.status(400).json({ success: false, error: 'Serial number required' });
        }

        res.status(200).json({
            success: true,
            data: {
                isValid: true,
                studentName: "Verified Student",
                courseName: "Verified Course",
                completionDate: new Date(),
                serialNumber
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Update Certificate Settings
// @route   PUT /api/v1/certificate/settings
// @access  Private (Admin)
router.put('/settings', async (req, res) => {
    try {
        const { settings } = req.body;

        let config = await Settings.findOne({ where: { category: 'certificate' } });

        if (config) {
            await config.update({ settings });
        } else {
            config = await Settings.create({
                category: 'certificate', // ENUM support or string
                settings
            });
        }

        res.status(200).json({
            success: true,
            data: config.settings
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Get Certificate Settings
// @route   GET /api/v1/certificate/settings
// @access  Public (or Private)
router.get('/settings', async (req, res) => {
    try {
        const settings = await Settings.findOne({ where: { category: 'certificate' } });
        res.status(200).json({
            success: true,
            data: settings ? settings.settings : {}
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
