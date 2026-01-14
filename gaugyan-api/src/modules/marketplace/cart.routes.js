const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart
} = require('./cart.controller');
const { protect } = require('../../shared/middleware/protect');

// All routes require authentication
router.use(protect);

// Cart routes
router.route('/')
  .get(getCart)
  .delete(clearCart);

router.route('/items')
  .post(addItemToCart);

router.route('/items/:id')
  .put(updateCartItem)
  .delete(removeItemFromCart);

module.exports = router;