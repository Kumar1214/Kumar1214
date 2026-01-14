const express = require('express');
const router = express.Router();
const VerificationRequest = require('./VerificationRequest');
const User = require('./User');
const { auth, requireRole } = require('../../shared/middleware/auth');
const { Sequelize } = require('sequelize');

// POST /api/verification - Submit Request
router.post('/', auth, async (req, res) => {
    try {
        const { type, aadharNumber, aadharCardUrl, panNumber, panCardUrl, gstNumber, gstCertificateUrl } = req.body;

        // Check for existing pending request
        const existing = await VerificationRequest.findOne({
            where: {
                userId: req.user.id,
                status: 'pending'
            }
        });

        if (existing) {
            return res.status(400).json({ success: false, message: 'You already have a pending verification request.' });
        }

        const request = await VerificationRequest.create({
            userId: req.user.id,
            type,
            aadharNumber,
            aadharCardUrl,
            panNumber,
            panCardUrl,
            gstNumber,
            gstCertificateUrl
        });

        res.status(201).json({ success: true, data: request });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/verification/my-status
router.get('/my-status', auth, async (req, res) => {
    try {
        const request = await VerificationRequest.findOne({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: request });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/verification/pending (Admin)
router.get('/pending', auth, requireRole('Admin'), async (req, res) => {
    try {
        const requests = await VerificationRequest.findAll({
            where: { status: 'pending' },
            include: [{ model: User, attributes: ['name', 'email', 'id', 'role'] }],
            order: [['createdAt', 'ASC']]
        });
        res.json({ success: true, data: requests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/verification/:id/action (Approve/Reject)
router.put('/:id/action', auth, requireRole('Admin'), async (req, res) => {
    try {
        const { action, comments } = req.body; // action: 'approve' | 'reject'
        const request = await VerificationRequest.findByPk(req.params.id);

        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        if (action === 'approve') {
            request.status = 'approved';
            request.adminComments = comments || 'Approved by Admin';
            await request.save();

            // Update User Verified Status
            await User.update({ isVerified: true }, { where: { id: request.userId } });

        } else if (action === 'reject') {
            request.status = 'rejected';
            request.adminComments = comments || 'Rejected by Admin';
            await request.save();
        }

        res.json({ success: true, message: `Request ${action}ed` });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
