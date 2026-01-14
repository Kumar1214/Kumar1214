const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('./product.controller');
const { auth, optionalAuth, requireRole } = require('../../shared/middleware/auth');

// @route   GET /api/products
// @desc    Get all products (with filtering/search)
// @access  Public
router.get('/', optionalAuth, getProducts);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Create a product
// @access  Private (Vendor/Admin)
router.post('/', auth, requireRole('Vendor', 'Admin', 'GaushalaOwner'), createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Vendor/Admin)
router.put('/:id', auth, requireRole('Vendor', 'Admin', 'GaushalaOwner'), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Vendor/Admin)
router.delete('/:id', auth, requireRole('Vendor', 'Admin', 'GaushalaOwner'), deleteProduct);

module.exports = router;
