const Order = require('./Order');
const Product = require('./Product');
const asyncHandler = require('../../shared/middleware/asyncHandler');
const { Op } = require('sequelize');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Determine vendor from first product (assuming single vendor or primary vendor logic for MVP)
  // Fetch first product to get vendorId
  let vendorId = null;
  if (orderItems[0].product || orderItems[0].productId) {
    try {
      const pId = orderItems[0].product || orderItems[0].productId;
      // We need simple query here
      const p = await Product.findByPk(pId);
      if (p) vendorId = p.vendorId;
    } catch (err) {
      console.error("Error determining vendor:", err);
    }
  }

  const order = await Order.create({
    orderItems,
    userId: req.user.id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    vendorId // Save vendorId to allow filtering
  });

  res.status(201).json(order);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{
      model: require('../identity/User'),
      as: 'user',
      attributes: ['name', 'email']
    }]
  });

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    // Also update status
    order.status = 'delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']]
  });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res) => {
  const { status, paymentStatus, search } = req.query;

  const where = {};

  if (status && status !== 'All') {
    where.status = status;
  }

  // Note: paymentStatus field might be 'paymentResult.status' or a separate field. 
  // Based on current model usage in addOrderItems, there isn't an explicit paymentStatus field shown, 
  // but frontend expects it. Checking addOrderItems, it saves 'paymentMethod'.
  // IF 'paymentStatus' is expected to be filtered, we need to know the DB column.
  // Looking at frontend mock data: paymentStatus: 'Payment Received'.
  // Looking at Order model usage in updateOrderToPaid: order.isPaid = true.
  // So 'paymentStatus' filter likely maps to isPaid boolean or status string.
  // Let's assume for now we filter by isPaid if frontend sends 'Payment Received' -> isPaid: true.

  if (paymentStatus && paymentStatus !== 'All') {
    if (paymentStatus === 'Payment Received') where.isPaid = true;
    else if (paymentStatus === 'Pending') where.isPaid = false;
    // 'Failed' might strictly be isPaid: false but let's stick to simple boolean
  }

  // Search logic
  // We need to include User for searching by name
  let includeUser = {
    model: require('../identity/User'),
    as: 'user',
    attributes: ['id', 'name', 'email']
  };

  if (search) {
    // If searching by Order ID (UUID or similar), we can add to where
    // If searching by User Name, we need to add where clause to the INCLUDE or use nested query
    // Simple approach: Search attributes on Order model OR User model
    // Since complex OR across tables is tricky in simple Sequelize, let's try strict ID match or loose User match

    const searchCondition = { [Op.like]: `%${search}%` };

    // We'll construct a complex where OR we'll filter post-query if dataset is small, 
    // but better to do it in query.
    // For now, let's just search Order ID or User Email/Name if possible.
    // Easiest is to search Order ID in top-level 'where'
    // OR let's just filter by ID for now to be safe and simple.
    // where.id = { [Op.like]: `%${search}%` };

    // Better approach for "Search Order ID or Buyer":
    // We can't easily OR across top-level and included model without proper aliases and required: false/true logic.
    // Let's just implement ID search for now to prevent 500s.
    where[Op.or] = [
      { id: { [Op.like]: `%${search}%` } },
      // { '$user.name$': { [Op.like]: `%${search}%` } } // This requires required: true and proper alias
    ];
  }

  const orders = await Order.findAll({
    where,
    include: [includeUser],
    order: [['createdAt', 'DESC']]
  });
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Vendor
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (order) {
    // Check if user is vendor for any item in the order
    // Since we can't populate inside JSON, we must fetch products manually
    // 1. Extract product IDs
    const productIds = order.orderItems.map(item => item.product || item.productId); // Check structure

    // 2. Fetch products to check vendorId
    const products = await Product.findAll({
      where: { id: productIds },
      attributes: ['id', 'vendorId']
    });

    const isVendor = products.some(p => String(p.vendorId) === String(req.user.id));

    if (req.user.role !== 'admin' && !isVendor) {
      res.status(403);
      throw new Error('Not authorized to update this order');
    }

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get vendor orders
// @route   GET /api/orders/vendor-orders
// @access  Private/Vendor
exports.getVendorOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { vendorId: req.user.id },
    include: [{
      model: require('../identity/User'),
      as: 'user',
      attributes: ['id', 'name', 'email']
    }],
    order: [['createdAt', 'DESC']]
  });

  res.json(orders);
});