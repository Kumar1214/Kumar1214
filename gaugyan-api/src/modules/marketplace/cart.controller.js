const Cart = require('./Cart');
const Product = require('./Product');
const asyncHandler = require('../../shared/middleware/asyncHandler');

// Helper to "populate" items
const populateCartItems = async (cart) => {
  if (!cart || !cart.items || cart.items.length === 0) return cart.toJSON ? cart.toJSON() : cart;

  const cartData = cart.toJSON ? cart.toJSON() : cart;
  const productIds = cartData.items.map(i => i.product);

  const products = await Product.findAll({
    where: { id: productIds },
    attributes: ['id', 'name', 'price', 'images', 'stock', 'slug'] // Select fields needed by frontend
  });

  // Map products to items
  cartData.items = cartData.items.map(item => {
    const product = products.find(p => String(p.id) === String(item.product));
    return {
      ...item,
      product: product || null // Replace ID with product object
    };
  });

  return cartData;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!cart) {
    cart = await Cart.create({ userId: req.user.id, items: [] });
  }

  const populatedCart = await populateCartItems(cart);
  res.json(populatedCart);
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // Check if product exists
  const product = await Product.findByPk(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if product is in stock
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough product in stock');
  }

  // Get or create cart
  // Use user id directly
  let cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!cart) {
    cart = await Cart.create({ userId: req.user.id, items: [] });
  }

  // Sequelize doesn't automatically detect deep changes in JSON unless we reassign
  let items = [...cart.items]; // Clone array

  // Check if item already exists in cart
  const existingItemIndex = items.findIndex(
    item => String(item.product) === String(productId)
  );

  if (existingItemIndex > -1) {
    // Update quantity
    items[existingItemIndex].quantity += quantity;
    // ensure price is updated
    items[existingItemIndex].price = product.price;
  } else {
    // Add new item
    items.push({
      product: productId,
      quantity,
      price: product.price
    });
  }

  // Update cart
  cart.items = items;
  await cart.save();

  const populatedCart = await populateCartItems(cart);
  res.status(201).json(populatedCart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:id
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;

  const product = await Product.findByPk(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough product in stock');
  }

  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  let items = [...cart.items];
  const itemIndex = items.findIndex(
    item => String(item.product) === String(productId)
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  items[itemIndex].quantity = quantity;
  cart.items = items;
  await cart.save();

  const populatedCart = await populateCartItems(cart);
  res.json(populatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:id
// @access  Private
exports.removeItemFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    item => String(item.product) !== String(productId)
  );

  await cart.save();

  const populatedCart = await populateCartItems(cart);
  res.json(populatedCart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = [];
  await cart.save();

  res.json(cart);
});