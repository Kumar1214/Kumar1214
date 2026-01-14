const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getVendorOrders
} = require('./order.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

// All routes require authentication
router.use(protect);

router.route('/')
  .post(addOrderItems)
  .get(authorize('admin'), getOrders);

router.route('/myorders').get(getMyOrders);
router.route('/vendor-orders').get(getVendorOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/pay')
  .put(updateOrderToPaid);

router.route('/:id/deliver')
  .put(authorize('admin'), updateOrderToDelivered);

router.route('/:id/status')
  .put(updateOrderStatus);

module.exports = router;