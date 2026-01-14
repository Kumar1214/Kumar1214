const express = require('express');
const router = express.Router();
const CommunityPost = require('./CommunityPost');
const Community = require('./Community');
const User = require('../identity/User');
const { protect } = require('../../shared/middleware/protect'); // Corrected path to protect middleware

// Get all posts (Public or Protected? Plan says protect all, but usually feed is public or protected. Let's make it protected as per plan "Community Access is Locked")
// Actually, generic view might be public, but let's stick to protecting it for now to ensure we have req.user for "liked" status check if implemented later.
// For now, let's keep GET public but POST/PUT/DELETE protected.
// WAIT, the plan said "Add protect middleware to all sensitive routes".
// User request: "community feature will be implemented in all users types".

// User request: "community feature will be implemented in all users types".

// --- Community Groups Management ---

// Create a new Community Group (Admin Only)
router.post('/groups', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { name, description, icon, type } = req.body;
        const community = await Community.create({
            name,
            description,
            icon,
            type,
            slug: name.toLowerCase().replace(/ /g, '-'),
            subscriberCount: 0
        });
        res.status(201).json({ success: true, community });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Community Groups
router.get('/groups', async (req, res) => {
    try {
        const groups = await Community.findAll({
            order: [['name', 'ASC']]
        });
        res.json({ success: true, groups });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Community Group
router.put('/groups/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const group = await Community.findByPk(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });

        await group.update(req.body);
        res.json({ success: true, group });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -----------------------------------

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = { isPublished: true };
        if (category && category !== 'All') {
            where.category = category;
        }

        const { count, rows } = await CommunityPost.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
            include: [
                { model: User, as: 'author', attributes: ['id', 'name', 'email', 'profilePicture', 'role'] }
            ]
        });

        res.json({
            posts: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            total: count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Join a Community Category
router.post('/join', protect, async (req, res) => {
    try {
        const { category } = req.body; // In new flow, this should be an ID or name
        if (!category) return res.status(400).json({ error: 'Category is required' });

        const user = await User.findByPk(req.user.id);
        let joined = user.joinedCommunities || [];
        if (!Array.isArray(joined)) joined = [];

        if (!joined.includes(category)) {
            joined = [...joined, category];
            await user.update({ joinedCommunities: joined });

            // Increment Subscriber Count
            const group = await Community.findOne({ where: { name: category } });
            if (group) {
                await group.increment('subscriberCount');
            }
        }

        res.json({ success: true, joinedCommunities: joined });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Leave a Community Category
router.post('/leave', protect, async (req, res) => {
    try {
        const { category } = req.body;
        if (!category) return res.status(400).json({ error: 'Category is required' });

        const user = await User.findByPk(req.user.id);
        let joined = user.joinedCommunities || [];
        if (!Array.isArray(joined)) joined = [];

        if (joined.includes(category)) {
            joined = joined.filter(c => c !== category);
            await user.update({ joinedCommunities: joined });

            // Decrement Subscriber Count
            const group = await Community.findOne({ where: { name: category } });
            if (group && group.subscriberCount > 0) {
                await group.decrement('subscriberCount');
            }
        }

        res.json({ success: true, joinedCommunities: joined });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get My Joined Communities
router.get('/my-communities', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json({
            success: true,
            joinedCommunities: user.joinedCommunities || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single post
router.get('/:id', async (req, res) => {
    try {
        const post = await CommunityPost.findByPk(req.params.id, {
            include: [
                { model: User, as: 'author', attributes: ['id', 'name', 'email', 'profilePicture', 'role'] }
            ]
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create post
router.post('/', protect, async (req, res) => {
    try {
        const { content, media } = req.body;
        const userId = req.user.id;

        const post = await CommunityPost.create({
            authorId: userId,
            content,
            category: req.body.category || 'General',
            media: media || [],
            isPublished: true
        });

        const fullPost = await CommunityPost.findByPk(post.id, {
            include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email', 'profilePicture', 'role'] }]
        });

        res.status(201).json({
            success: true,
            post: fullPost
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update post
router.put('/:id', protect, async (req, res) => {
    try {
        const { content, media, isPublished } = req.body;
        const post = await CommunityPost.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check ownership
        if (post.authorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this post' });
        }

        const updateData = {};
        if (content !== undefined) updateData.content = content;
        if (media !== undefined) updateData.media = media;
        if (isPublished !== undefined) updateData.isPublished = isPublished;

        await post.update(updateData);

        const fullPost = await CommunityPost.findByPk(post.id, {
            include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email', 'profilePicture', 'role'] }]
        });

        res.json({
            success: true,
            post: fullPost
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete post
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await CommunityPost.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check ownership
        if (post.authorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }

        await post.destroy();

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Like/Unlike post
router.post('/:id/like', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const post = await CommunityPost.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        let likes = post.likes || [];
        // Ensure likes is an array (Postgres JSONb might need handling if null)
        if (!Array.isArray(likes)) likes = [];

        const likeIndex = likes.indexOf(userId);

        if (likeIndex > -1) {
            // Unlike
            likes = likes.filter(id => id !== userId);
        } else {
            // Like
            likes = [...likes, userId];
        }

        await post.update({ likes });

        res.json({
            success: true,
            likes: likes.length,
            isLiked: likeIndex === -1,
            likesArray: likes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add comment
router.post('/:id/comment', protect, async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const userName = req.user.name; // Assuming req.user is populated with name
        const userAvatar = req.user.profilePicture;

        const post = await CommunityPost.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = {
            id: Date.now(), // Simple ID generation
            authorId: userId,
            authorName: userName,
            authorAvatar: userAvatar,
            content,
            createdAt: new Date()
        };

        const comments = [...(post.comments || []), newComment];
        await post.update({ comments });

        res.json({
            success: true,
            comments
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
