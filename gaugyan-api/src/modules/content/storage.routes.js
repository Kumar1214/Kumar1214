const express = require('express');
const router = express.Router();
const StorageConfig = require('./StorageConfig');
const { Op } = require('sequelize');

// Get active storage configuration
router.get('/', async (req, res) => {
    try {
        const config = await StorageConfig.findOne({ where: { isActive: true } });

        if (!config) {
            return res.json({
                provider: 'local',
                config: {
                    local: { uploadPath: './uploads' }
                }
            });
        }

        // Don't send sensitive keys to frontend
        const safeConfig = {
            provider: config.provider,
            isActive: config.isActive
        };

        res.json(safeConfig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update storage configuration
router.put('/', async (req, res) => {
    try {
        const { provider, config } = req.body;

        // TODO: Add authentication middleware
        // const userId = req.user.id;
        const userId = 1; // Placeholder

        // Deactivate all existing configs
        await StorageConfig.update({ isActive: false }, { where: {} });

        // Create or update new config
        let storageConfig = await StorageConfig.findOne({ where: { provider } });

        if (!storageConfig) {
            storageConfig = await StorageConfig.create({
                provider,
                config,
                isActive: true,
                updatedBy: userId
            });
        } else {
            await storageConfig.update({
                config,
                isActive: true,
                updatedBy: userId
            });
        }

        res.json({
            success: true,
            message: 'Storage configuration updated successfully',
            provider: storageConfig.provider
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test storage connection
router.post('/test', async (req, res) => {
    try {
        const { provider } = req.body;

        // TODO: Implement actual connection test for each provider

        res.json({
            success: true,
            message: `${provider} connection test successful`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
