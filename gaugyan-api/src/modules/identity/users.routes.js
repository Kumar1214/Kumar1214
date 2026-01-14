const express = require('express');
const router = express.Router();
const User = require('./User');
const { protect, authorize } = require('../../shared/middleware/protect');

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        // Users can view their own profile or admins can view any profile
        // req.user.id is integer in Sequelize if mapped correctly, but check types
        if (req.user.role !== 'admin' && req.user.id != req.params.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this user' });
        }

        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users
// @desc    Create a user (Admin only)
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.create(req.body);
        // Exclude password in response
        const userData = user.toJSON();
        delete userData.password;
        res.status(201).json(userData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        // Users can update their own profile or admins can update any profile
        if (req.user.role !== 'admin' && req.user.id != req.params.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this user' });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.update(req.body);

        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users/wishlist/toggle
// @desc    Toggle product in wishlist
// @access  Private
router.post('/wishlist/toggle', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Clone current wishlist array
        let currentWishlist = [...(user.wishlist || [])];

        // Check if product is already in wishlist
        const index = currentWishlist.indexOf(productId);
        if (index > -1) {
            // Remove
            currentWishlist.splice(index, 1);
        } else {
            // Add
            currentWishlist.push(productId);
        }

        // Update user (Sequeize detects change in JSON if reference changes or explicit set)
        user.wishlist = currentWishlist;
        await user.save();

        // In Sequelize, unlike Mongoose toggle with populate, we might just return the list of IDs 
        // OR we need to fetch Products manually if frontend expects populated objects.
        // The original code tried to populate. Sequelize JSON array doesn't support auto-populate.
        // We will return the IDs for now. If frontend needs objects, we'd need to fetch them.

        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/users/wishlist
// @desc    Get user wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const wishlistIds = user.wishlist || [];

        // Fetch actual product details if wishlist has items
        // Since we don't have a direct Product import here easily without circular dep risk potentially,
        // or just strict separation, let's try to query if possible or just return IDs.
        // For a proper implementation, we should import the Product model relative to this file.
        // Assuming Product model is in ../marketplace/Product
        // const Product = require('../marketplace/Product');
        // if (wishlistIds.length > 0) {
        //    const products = await Product.findAll({ where: { id: wishlistIds } });
        //    return res.json(products);
        // }

        res.json(wishlistIds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/users/my-courses
// @desc    Get user's enrolled courses with details
// @access  Private
router.get('/my-courses', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const enrolled = user.enrolledCourses || [];

        if (enrolled.length === 0) {
            return res.json([]);
        }

        const courseIds = enrolled.map(e => e.courseId);

        // Import Course model dynamically to avoid circular issues or standard require
        const Course = require('../learning/Course');
        const User = require('./User'); // Instructor info

        const courses = await Course.findAll({
            where: {
                id: courseIds
            },
            include: [{
                model: User,
                as: 'instructor',
                attributes: ['name']
            }]
        });

        // Merge progress data with course details
        const result = courses.map(course => {
            const enrollment = enrolled.find(e => e.courseId === course.id);
            const courseJson = course.toJSON();
            return {
                ...courseJson,
                progress: enrollment ? (enrollment.progress || 0) : 0,
                completedLectures: enrollment ? (enrollment.completedLectures || []) : [],
                enrolledAt: enrollment ? enrollment.enrolledAt : null,
                instructor: course.instructor ? course.instructor.name : 'Unknown'
            };
        });

        res.json(result);
    } catch (error) {
        console.error("Get My Courses Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/users/enroll
// @desc    Enroll in a course (for Free courses or after payment)
// @access  Private
router.post('/enroll', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: 'Course ID is required' });
        }

        // Clone current enrolledCourses array
        let currentEnrollments = [...(user.enrolledCourses || [])];
        const idInt = parseInt(courseId);

        // Check if already enrolled
        const exists = currentEnrollments.find(e => e.courseId === idInt);

        if (!exists) {
            // Add new enrollment
            currentEnrollments.push({
                courseId: idInt,
                progress: 0,
                completedLectures: [],
                enrolledAt: new Date()
            });

            // Update user
            user.enrolledCourses = currentEnrollments;
            // Force update for JSON column (Sequelize sometimes misses deep changes)
            user.changed('enrolledCourses', true);
            await user.save();
        }

        res.json(user.enrolledCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/users/:id/verify
// @desc    Verify/Approve a user
// @access  Private (Admin)
router.put('/:id/verify', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.update({ isVerified: true });

        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users/progress
// @desc    Update course progress (mark lecture complete)
// @access  Private
router.post('/progress', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const { courseId, lectureId } = req.body;

        if (!courseId || lectureId === undefined) {
            return res.status(400).json({ message: 'Course ID and Lecture ID are required' });
        }

        let currentEnrollments = [...(user.enrolledCourses || [])];
        const idInt = parseInt(courseId);
        const lectureIdInt = parseInt(lectureId);

        const index = currentEnrollments.findIndex(e => e.courseId === idInt);

        if (index > -1) {
            const enrollment = { ...currentEnrollments[index] };
            const completed = enrollment.completedLectures || [];

            if (!completed.includes(lectureIdInt)) {
                completed.push(lectureIdInt);
                enrollment.completedLectures = completed;

                // Calculate progress (requires total lectures, but we might not have it here easily without fetching course)
                // For now, we just update the array. Frontend can calc percentage or we pass totalLectures
                // If totalLectures passed:
                if (req.body.totalLectures) {
                    enrollment.progress = Math.round((completed.length / req.body.totalLectures) * 100);
                }

                currentEnrollments[index] = enrollment;

                user.enrolledCourses = currentEnrollments;
                user.changed('enrolledCourses', true);
                await user.save();
            }
        } else {
            return res.status(404).json({ message: 'Not enrolled in this course' });
        }

        res.json(user.enrolledCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users/seed-demo-users
// @desc    Seed demo users if missing (Emergency Prod Fix)
// @access  Private (Admin)
router.post('/seed-demo-users', protect, authorize('admin'), async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const demoUsers = [
            { name: 'Demo Vendor', email: 'vendor@gaugyan.com', role: 'vendor' },
            { name: 'Demo Instructor', email: 'instructor@gaugyan.com', role: 'instructor' },
            { name: 'Demo Artist', email: 'artist@gaugyan.com', role: 'artist' },
            { name: 'Demo Editor', email: 'editor@gaugyan.com', role: 'editor' },
            { name: 'Demo Owner', email: 'owner@gaugyan.com', role: 'gaushala_owner' },
            { name: 'Demo Author', email: 'author@gaugyan.com', role: 'author' },
            { name: 'Demo Astrologer', email: 'astrologer@gaugyan.com', role: 'astrologer' },
            { name: 'Demo Admin', email: 'admin@gaugyan.com', role: 'admin' },
            { name: 'Demo User', email: 'user@gaugyan.com', role: 'user' }
        ];

        const results = [];

        for (const u of demoUsers) {
            const user = await User.findOne({ where: { email: u.email } });

            // Do NOT hash manually, let User model hooks handle it
            const plainPassword = 'Password@123';

            if (!user) {
                await User.create({
                    name: u.name,
                    email: u.email,
                    password: plainPassword,
                    role: u.role,
                    isVerified: true
                });
                results.push(`Created: ${u.email}`);
            } else {
                // FORCE UPDATE PASSWORD for demo accounts to ensure access
                // Only update if role matches or just force it for these specific emails
                user.password = plainPassword;
                user.isVerified = true; // Ensure verified
                if (user.role !== 'admin') user.role = u.role; // Reset role if not admin (safety)
                await user.save();
                results.push(`Updated: ${u.email}`);
            }
        }

        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
