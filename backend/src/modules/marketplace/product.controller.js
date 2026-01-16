const Product = require('./Product');
const User = require('../identity/User');
const { Op } = require('sequelize');
const { notifyAdmins } = require('../../shared/utils/notificationService');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
// Helper: Build Search Filter
const buildSearchQuery = (search) => {
    if (!search) return {};
    return {
        [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ]
    };
};

// Helper: Build Price Filter
const buildPriceQuery = (minPrice, maxPrice) => {
    if (!minPrice && !maxPrice) return {};
    const priceQuery = {};
    if (minPrice) priceQuery[Op.gte] = Number(minPrice);
    if (maxPrice) priceQuery[Op.lte] = Number(maxPrice);
    return { price: priceQuery };
};

// Helper: Determine Status Filter
const buildStatusQuery = (status, user, vendor, role) => {
    if (status) return { status };

    // Default visibility rules
    const requestingOwnProducts = user && vendor && String(vendor) === String(user.id);
    const isAdmin = role === 'admin';

    if (isAdmin || requestingOwnProducts) {
        return {}; // Show all
    }
    return { status: 'active' }; // Public/Active only
};

// Helper: Build Sort Order
const buildSortOrder = (sort) => {
    switch (sort) {
        case 'price_asc': return [['price', 'ASC']];
        case 'price_desc': return [['price', 'DESC']];
        case 'rating': return [['rating', 'DESC']];
        case 'popular': return [['soldCount', 'DESC']];
        default: return [['createdAt', 'DESC']];
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, vendor, status, sort, page = 1, limit = 10, userRole } = req.query;

        const effectiveRole = (req.user?.accountType || req.user?.role || userRole || '').toLowerCase();

        // Compose Where Clause
        const where = {
            ...buildSearchQuery(search),
            ...buildPriceQuery(minPrice, maxPrice),
            ...(category && { category }),
            ...(vendor && { vendorId: vendor }),
            ...buildStatusQuery(status, req.user, vendor, effectiveRole)
        };

        // Pagination & Sort
        const pageNum = Number.parseInt(page);
        const limitNum = Number.parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const order = buildSortOrder(sort);

        const { count, rows } = await Product.findAndCountAll({
            where,
            include: [{
                model: User,
                as: 'vendor',
                attributes: ['name', 'email']
            }],
            order,
            offset,
            limit: limitNum,
            distinct: true
        });

        res.status(200).json({
            success: true,
            count: rows.length,
            total: count,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum,
            data: rows
        });

    } catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'vendor',
                attributes: ['name', 'email']
            }]
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Note: reviews population manually if needed, but reviews are JSON now.
        // We'd need to manually fetch users for reviews if we wanted 'displayName', 
        // but for MVP migration, let's just return the JSON object.

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error getting product by ID:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        // Ensure vendor is set correctly from authenticated user
        // req.user has { id, ... } from auth middleware (which decodes token)
        // OR { id, ... } from protect middleware (which fetches User).
        // Standardize on using `req.user.id`.

        // Default to logic: if req.user has id, use it.
        const vendorId = req.user ? req.user.id : null;

        // For testing/migration if no user:
        if (!vendorId && process.env.NODE_ENV !== 'production') {
            // Handle appropriately or error
        }

        const productData = {
            ...req.body,
            vendorId: vendorId, // Use the new column name
            vendorName: req.user ? req.user.name : undefined,
            variants: req.body.variants || [],
            images: req.body.images || [],
            tags: req.body.tags || []
        };

        const product = await Product.create(productData);

        // Notify Admins
        await notifyAdmins(
            `New Product Created: ${product.name}`,
            'info',
            { productId: product.id, vendorId }
        );

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Vendor/Admin)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check ownership
        // req.user.id must match product.vendorId
        // Handling ID types: ensure string comparison if necessary or int
        if (req.user.role !== 'admin' && String(product.vendorId) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
        }

        const updatedProduct = await product.update(req.body);

        // Notify Admins
        await notifyAdmins(
            `Product Updated: ${updatedProduct.name}`,
            'info',
            { productId: updatedProduct.id, updatedBy: req.user.id }
        );

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Vendor/Admin)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (req.user.role !== 'admin' && String(product.vendorId) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
        }

        await product.destroy();

        // Notify Admins
        await notifyAdmins(
            `Product Deleted: ${product.name}`,
            'warning',
            { productId: req.params.id, deletedBy: req.user.id }
        );

        res.status(200).json({ success: true, message: 'Product deleted successfully' });


    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
