const Product = require('./Product');
const Order = require('./Order');
const VendorProfile = require('./VendorProfile');
const User = require('../identity/User');
const asyncHandler = require('../../shared/middleware/asyncHandler');
const { Op } = require('sequelize');

// @desc    Get vendor dashboard stats
// @route   GET /api/ecommerce/vendors/dashboard/stats
// @access  Private/Vendor
exports.getVendorStats = asyncHandler(async (req, res) => {
  // Get products count
  const productsCount = await Product.count({ where: { vendorId: req.user.id } });

  // Get orders count and revenue
  // Find products owned by vendor to filter orders
  // In SQL, we can join explicitly or search JSON if OrderItems is JSON
  // OrderItems is JSON in Order.js, containing { product: id }
  // This is hard to join in SQL directly on JSON without specific dialect support (MySQL 5.7+ supports ->)
  // For simplicity: fetch all products IDs, then search in JSON.

  /* const products = await Product.findAll({
    where: { vendorId: req.user.id },
    attributes: ['id']
  }); */
  // const productIds = products.map(p => p.id);

  // If dialect supports JSON operations fully (Postgres/MySQL)
  // But let's standard way: findAll orders, filter in memory if volume low or use dialect specific Op
  // Assuming volume is manageable for this logic or we use improved schema later
  // Better: Order has 'vendorId' column if single vendor per order. 
  // Order.js has `vendorId`!

  const ordersCount = await Order.count({ where: { vendorId: req.user.id } });

  // To get revenue, sum totalPrice
  const revenueResult = await Order.sum('totalPrice', { where: { vendorId: req.user.id } });
  const totalRevenue = revenueResult || 0;

  res.json({
    success: true,
    data: {
      productsCount,
      ordersCount,
      totalRevenue
    }
  });
});

// @desc    Get vendor products
// @route   GET /api/ecommerce/vendors/products
// @access  Private/Vendor
exports.getVendorProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    where: { vendorId: req.user.id },
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get vendor orders
// @route   GET /api/ecommerce/vendors/orders
// @access  Private/Vendor
exports.getVendorOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { vendorId: req.user.id },
    include: [
      { model: User, as: 'user', attributes: ['name', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Update order status
// @route   PUT /api/ecommerce/vendors/orders/:id/status
// @access  Private/Vendor
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  const order = await Order.findByPk(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check ownership
  if (order.vendorId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  // Update order status
  await order.update({ status });

  res.json({
    success: true,
    data: order
  });
});

// @desc    Register a new vendor
// @route   POST /api/ecommerce/vendors
// @access  Private
exports.registerVendor = asyncHandler(async (req, res) => {
  const { storeName, storeDescription, address, contactEmail, contactPhone, gstNumber } = req.body;

  const vendorExists = await VendorProfile.findOne({ where: { userId: req.user.id } });
  if (vendorExists) {
    res.status(400);
    throw new Error('Vendor profile already exists for this user');
  }

  const vendor = await VendorProfile.create({
    userId: req.user.id,
    storeName,
    storeDescription,
    address,
    contactEmail: contactEmail || req.user.email,
    contactPhone,
    gstNumber
  });

  res.status(201).json({
    success: true,
    data: vendor
  });
});

// @desc    Get current vendor profile
// @route   GET /api/ecommerce/vendors/me
// @access  Private
exports.getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await VendorProfile.findOne({ where: { userId: req.user.id } });
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor profile not found');
  }
  res.status(200).json({ success: true, data: vendor });
});

// @desc    Get all vendors (Admin)
// @route   GET /api/ecommerce/vendors (Admin)
// @access  Private/Admin
exports.getAllVendors = asyncHandler(async (req, res) => {
  const vendors = await VendorProfile.findAll({
    include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
  });
  res.status(200).json({ success: true, count: vendors.length, data: vendors });
});

// @desc    Update vendor status (Admin)
// @route   PUT /api/ecommerce/vendors/:id/status
// @access  Private/Admin
exports.updateVendorStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const vendor = await VendorProfile.findByPk(req.params.id);

  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  await vendor.update({ status });

  if (status === 'approved') {
    const user = await User.findByPk(vendor.userId);
    if (user && user.role !== 'admin') {
      user.role = 'vendor';
      await user.save();
    }
  }

  res.status(200).json({ success: true, data: vendor });
});