const express = require('express');
const router = express.Router();
const Settings = require('./Settings');

// Get settings by category
router.get('/:category', async (req, res) => {
    console.log('DEBUG: Generic Settings Route Hit:', req.params.category);
    try {
        const { category } = req.params;

        let settings = await Settings.findOne({ where: { category } });

        if (!settings) {
            // Return default empty settings
            return res.json({ category, settings: {} });
        }

        // Return JSON directly, no Map conversion needed
        res.json({
            category: settings.category,
            settings: settings.settings,
            updatedAt: settings.updatedAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update settings by category
router.put('/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { settings } = req.body;

        // TODO: Add authentication middleware
        // const userId = req.user.id; // Assuming auth middleware is added later or user is passed

        let settingsDoc = await Settings.findOne({ where: { category } });

        if (!settingsDoc) {
            settingsDoc = await Settings.create({
                category,
                settings // Sequelize handles JSON stringification/parsing
                // updatedBy: userId
            });
        } else {
            // Update
            await settingsDoc.update({ settings });
            settingsDoc = await Settings.findOne({ where: { category } }); // Reload to be safe/clean
        }

        res.json({
            success: true,
            message: 'Settings updated successfully',
            settings: settingsDoc
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all settings
router.get('/', async (req, res) => {
    try {
        const allSettings = await Settings.findAll();

        const result = {};
        allSettings.forEach(setting => {
            result[setting.category] = setting.settings;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test email sending
router.post('/email/test', async (req, res) => {
    try {
        const { to } = req.body;
        const { sendEmail } = require('../../shared/services/email.service');
        const success = await sendEmail({
            to,
            subject: 'Test Email from GauGyan',
            html: '<h1>It Works!</h1><p>Your email configuration is correct.</p>',
            text: 'It Works! Your email configuration is correct.'
        });

        if (success) {
            res.json({ success: true, message: 'Test email sent' });
        } else {
            res.status(400).json({ error: 'Failed to send email. Check logs.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
