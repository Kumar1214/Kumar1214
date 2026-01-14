const { sequelize } = require('../../shared/config/database');
const { User, Order, Course, Product, Review, Payout } = sequelize.models;
const { Op } = require('sequelize');

exports.getAISummary = async (req, res) => {
    try {
        // parallel fetch for performance
        const [
            pendingOrders,
            pendingCourses,
            pendingProducts,
            pendingPayouts,
            pendingReviews,
            newUsers24h
        ] = await Promise.all([
            Order.count({ where: { status: 'Pending' } }).catch(() => 0),
            Course ? Course.count({ where: { status: 'pending' } }).catch(() => 0) : 0,
            Product ? Product.count({ where: { status: 'pending' } }).catch(() => 0) : 0,
            // Payout might not be a model yet, using mock if fails, or check if Payout model exists
            Payout ? Payout.count({ where: { status: 'pending' } }).catch(() => 0) : 0,
            Review ? Review.count({ where: { status: 'pending' } }).catch(() => 0) : 0,
            User.count({
                where: {
                    createdAt: { [Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                }
            }).catch(() => 0)
        ]);

        const items = [];

        if (pendingOrders > 0) {
            items.push({
                type: 'urgent',
                message: `${pendingOrders} new orders require processing.`,
                action: 'Manage Orders',
                link: '/admin/ecommerce/orders',
                icon: 'FiShoppingBag'
            });
        }

        if (pendingPayouts > 0) {
            items.push({
                type: 'warning',
                message: `${pendingPayouts} payout requests are pending approval.`,
                action: 'View Payouts',
                link: '/admin/ecommerce/payouts',
                icon: 'FiDollarSign'
            });
        }

        if (pendingCourses > 0 || pendingProducts > 0) {
            items.push({
                type: 'info',
                message: `${pendingCourses + pendingProducts} new content items (Courses/Products) need approval.`,
                action: 'Review Content',
                link: '/admin/courses/courses', // General link
                icon: 'FiCheckSquare'
            });
        }

        if (pendingReviews > 0) {
            items.push({
                type: 'info',
                message: `${pendingReviews} user reviews are awaiting moderation.`,
                action: 'Moderate Reviews',
                link: '/admin/moderation/reviews',
                icon: 'FiMessageSquare'
            });
        }

        if (newUsers24h > 0) {
            items.push({
                type: 'success',
                message: `${newUsers24h} new users joined in the last 24 hours!`,
                action: 'View Users',
                link: '/admin/users/all-users',
                icon: 'FiUsers'
            });
        }

        // Fallback if everything is clear
        if (items.length === 0) {
            items.push({
                type: 'success',
                message: "All systems operational. No urgent actions required.",
                action: 'View Analytics',
                link: '#analytics-section',
                icon: 'FiActivity'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                greeting: "Welcome back, Admin",
                summary: items,
                stats: {
                    pendingOrders,
                    newUsers24h
                }
            }
        });

    } catch (error) {
        console.error("AI Summary Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate AI summary",
            error: error.message
        });
    }
};
