const { Op } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const UserActivity = require('./UserActivity');
const User = require('../identity/User');
const Music = require('../entertainment/Music');
const Podcast = require('../entertainment/Podcast');
const Meditation = require('../entertainment/Meditation');
// const Product = require('../marketplace/Product'); // Assuming Product model exists

exports.getAnalytics = async (req, res) => {
    try {
        const { range = '7d' } = req.query; // 7d, 30d, today

        // Calculate Date Range
        const now = new Date();
        let startDate = new Date();
        if (range === 'today') startDate.setHours(0, 0, 0, 0);
        else if (range === '30d') startDate.setDate(now.getDate() - 30);
        else startDate.setDate(now.getDate() - 7); // Default 7d

        // 1. Daily Activity (Graph Data)
        // Group by Date(createdAt)
        const activityData = await UserActivity.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'visits'],
                [sequelize.fn('COUNT', sequelize.literal('DISTINCT userId')), 'uniqueUsers']
            ],
            where: {
                createdAt: { [Op.gte]: startDate }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
        });

        // 2. Top Pages
        const topPages = await UserActivity.findAll({
            attributes: ['route', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            where: {
                createdAt: { [Op.gte]: startDate },
                route: { [Op.notLike]: '/api/%' } // Exclude API calls, focus on pages
            },
            group: ['route'],
            order: [[sequelize.literal('count'), 'DESC']],
            limit: 10
        });

        // 3. Recent Users
        const recentUsers = await UserActivity.findAll({
            where: {
                createdAt: { [Op.gte]: startDate },
                userId: { [Op.ne]: null }
            },
            include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }],
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        // 4. Most Liked Content
        const topMusic = await Music.findAll({
            order: [['likes', 'DESC']],
            limit: 5,
            attributes: ['title', 'likes', 'artist']
        });

        const topMeditation = await Meditation.findAll({
            order: [['likes', 'DESC']],
            limit: 5,
            attributes: ['title', 'likes']
        });

        const topPodcasts = await Podcast.findAll({
            order: [['likes', 'DESC']],
            limit: 5,
            attributes: ['title', 'likes']
        });

        // 5. Most Wishlisted Items
        // This is complex because wishlist is a JSON array in the User table.
        // We might need a raw query or fetch all users and aggregate in JS (inefficient but workable for MVP).
        // For MVP with <1000 users, JS aggregation is fine.
        const usersWithWishlist = await User.findAll({
            attributes: ['wishlist'],
            where: {
                wishlist: { [Op.ne]: null }
            }
        });

        const wishlistCounts = {};
        usersWithWishlist.forEach(u => {
            const list = u.wishlist || [];
            if (Array.isArray(list)) {
                list.forEach(itemId => {
                    // Assuming itemId suggests product ID. 
                    // If wishlist contains formatted strings "product_1", "course_2", handling is needed.
                    // For now, simple aggregation:
                    wishlistCounts[itemId] = (wishlistCounts[itemId] || 0) + 1;
                });
            }
        });

        // Sort wishlist
        const sortedWishlist = Object.entries(wishlistCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([id, count]) => ({ id, count }));


        res.status(200).json({
            success: true,
            data: {
                activity: activityData,
                topPages,
                recentUsers,
                content: {
                    music: topMusic,
                    meditation: topMeditation,
                    podcasts: topPodcasts
                },
                wishlist: sortedWishlist
            }
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
