const express = require('express');
const router = express.Router();
const vendorController = require('./vendor.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

// All routes require authentication and vendor authorization
router.use(protect);
router.use(authorize('vendor'));

// Dashboard routes
router.get('/dashboard/stats', vendorController.getVendorStats);

// Product routes
router.get('/products', vendorController.getVendorProducts);

// Order routes
router.get('/orders', vendorController.getVendorOrders);
router.put('/orders/:id/status', vendorController.updateOrderStatus);

module.exports = router;