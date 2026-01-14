const express = require('express');
const router = express.Router();
const {
    registerVendor,
    getVendorProfile,
    getAllVendors,
    updateVendorStatus
} = require('./vendor.controller');
const { auth, requireRole } = require('../../shared/middleware/auth');

// Vendor Routes
router.post('/vendors', auth, registerVendor);
router.get('/vendors/me', auth, requireRole('Vendor', 'Admin'), getVendorProfile);
router.get('/vendors', auth, requireRole('Admin'), getAllVendors);
router.put('/vendors/:id/status', auth, requireRole('Admin'), updateVendorStatus);

module.exports = router;
