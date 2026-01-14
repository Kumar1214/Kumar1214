const express = require('express');
const router = express.Router();
const vendorController = require('./controller');
const { protect, authorize } = require('../../shared/middleware/protect');

// All routes require authentication
router.use(protect);

// Dashboard routes - Vendor only
router.get('/dashboard/stats', authorize('vendor'), vendorController.getVendorStats);

// Product routes - Vendor only
router.get('/products', authorize('vendor'), vendorController.getVendorProducts);

// Order routes - Vendor only
router.get('/orders', authorize('vendor'), vendorController.getVendorOrders);
router.put('/orders/:id/status', authorize('vendor'), vendorController.updateOrderStatus);

// Admin / Core Vendor Routes
router.post('/register', vendorController.registerVendor); // Public/Auth? Controller says Private (needs user id). Protect is on.
router.get('/me', authorize('vendor', 'admin'), vendorController.getVendorProfile);
router.get('/list', authorize('admin'), vendorController.getAllVendors);
router.put('/:id/status', authorize('admin'), vendorController.updateVendorStatus);
router.post('/admin/create', authorize('admin'), vendorController.createVendorByAdmin);

module.exports = router;