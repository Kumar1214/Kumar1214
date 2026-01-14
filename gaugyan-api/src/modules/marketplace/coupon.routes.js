const express = require('express');
const router = express.Router();
const Coupon = require('./Coupon');

const { auth, requireRole } = require('../../shared/middleware/auth');
const User = require('../identity/User');

// GET all coupons (Admin sees all, Vendor sees theirs)
router.get('/', auth, async (req, res) => {
    try {
        let where = {};
        // If vendor, filtering by vendorId
        if (req.user.role === 'vendor') {
            where.vendorId = req.user.id;
        }
        // If admin, can see all. Optionally filter by vendorId query param
        else if (req.user.role === 'admin') {
            if (req.query.vendorId) where.vendorId = req.query.vendorId;
        }

        const coupons = await Coupon.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json({ success: true, data: coupons });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CREATE Coupon
router.post('/', auth, requireRole('Admin', 'Vendor'), async (req, res) => {
    try {
        const { code, discount, type, validFrom, validUntil, usageLimit, minPurchase, applicableTo } = req.body;

        const coupon = await Coupon.create({
            code,
            discount,
            type,
            validFrom,
            validUntil,
            usageLimit,
            minPurchase,
            applicableTo,
            vendorId: req.user.role === 'vendor' ? req.user.id : null, // Admin = null (global)
            status: 'active'
        });

        res.status(201).json({ success: true, data: coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// UPDATE Coupon
router.put('/:id', auth, requireRole('Admin', 'Vendor'), async (req, res) => {
    try {
        const coupon = await Coupon.findByPk(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

        // Ownership check
        if (req.user.role !== 'admin' && coupon.vendorId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await coupon.update(req.body);
        res.json({ success: true, data: coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE Coupon
router.delete('/:id', auth, requireRole('Admin', 'Vendor'), async (req, res) => {
    try {
        const coupon = await Coupon.findByPk(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

        if (req.user.role !== 'admin' && coupon.vendorId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await coupon.destroy();
        res.json({ success: true, message: 'Coupon deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
