const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Banner = require('./Banner');
const User = require('../identity/User');

// Get banners by placement
router.get('/placement/:placement', async (req, res) => {
    try {
        const { placement } = req.params;
        const now = new Date();

        const banners = await Banner.findAll({
            where: {
                placement,
                isActive: true,
                [Op.or]: [
                    { startDate: null },
                    { startDate: { [Op.lte]: now } }
                ],
                [Op.and]: [
                    {
                        [Op.or]: [
                            { endDate: null },
                            { endDate: { [Op.gte]: now } }
                        ]
                    }
                ]
            },
            order: [['order', 'ASC']],
            attributes: { exclude: ['createdBy', 'createdAt', 'updatedAt'] }
        });

        res.json({ success: true, data: banners });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all banners (admin)
router.get('/', async (req, res) => {
    try {
        const { placement, active } = req.query;

        const where = {};
        if (placement) where.placement = placement;
        if (active !== undefined) where.isActive = active === 'true';

        const banners = await Banner.findAll({
            where,
            order: [['placement', 'ASC'], ['order', 'ASC']],
            include: [{
                model: User,
                as: 'creator',
                attributes: ['name', 'email']
            }]
        });

        res.json({ success: true, data: banners });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single banner
router.get('/:id', async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'creator',
                attributes: ['name', 'email']
            }]
        });

        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        res.json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create banner
router.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            imageUrl,
            linkUrl,
            buttonText,
            placement,
            order,
            isActive,
            startDate,
            endDate,
            backgroundColor,
            textColor
        } = req.body;

        // TODO: Add proper user ID from auth middleware
        // const userId = req.user ? req.user.id : null; 
        // For migration/testing, we can leave it null or map to an admin if known.
        // If the column allows null (it does by default unless strict), this is fine.

        const banner = await Banner.create({
            title,
            description,
            imageUrl,
            linkUrl,
            buttonText,
            placement,
            order,
            isActive,
            startDate,
            endDate,
            backgroundColor,
            textColor,
            // createdBy: userId // Uncomment when User ID is available
        });

        res.status(201).json({
            success: true,
            banner
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update banner
router.put('/:id', async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id);

        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        await banner.update(req.body);

        res.json({
            success: true,
            banner
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete banner
router.delete('/:id', async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id);

        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        await banner.destroy();

        res.json({
            success: true,
            message: 'Banner deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reorder banners
router.post('/reorder', async (req, res) => {
    try {
        const { banners } = req.body; // Array of { id, order }

        const updatePromises = banners.map(({ id, order }) =>
            Banner.update({ order }, { where: { id } })
        );

        await Promise.all(updatePromises);

        res.json({
            success: true,
            message: 'Banners reordered successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
