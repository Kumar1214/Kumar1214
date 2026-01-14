const Course = require('./Course');
const User = require('../identity/User');
const { Op } = require('sequelize');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
    try {
        const { search, category, level, instructor, sort, page = 1, limit = 10 } = req.query;

        // Build query
        const where = {};

        // Search
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
                // { 'curriculum.title': { [Op.like]: `%${search}%` } } // Complex JSON search not easily supported in basic SQL
            ];
        }

        // Filters
        if (category) where.category = category;
        if (level) where.level = level;
        // if (instructor) inner join on include

        // Default to published/active courses for public query unless specific override
        // if (req.query.status) {
        //     where.status = req.query.status;
        // } else {
        //     where.isPublished = true;
        // }

        // Sorting
        let order = [['createdAt', 'DESC']];
        if (sort) {
            if (sort === 'price_asc') order = [['price', 'ASC']];
            if (sort === 'price_desc') order = [['price', 'DESC']];
            if (sort === 'rating') order = [['rating', 'DESC']];
            if (sort === 'popular') order = [['students', 'DESC']];
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        const include = [{
            model: User,
            as: 'instructor',
            attributes: ['name', 'email'] // 'displayName' map to 'name' in User model
        }];

        if (instructor) {
            include[0].where = { id: instructor };
        }

        const { count, rows } = await Course.findAndCountAll({
            where,
            include,
            order,
            limit: limitNum,
            offset,
            distinct: true // Important for correct count with includes
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
        console.error("Get Courses Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'instructor',
                attributes: ['name', 'email']
            }]
        });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        console.error("Get Course Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private
exports.createCourse = async (req, res) => {
    try {
        // Add user to req.body
        const courseData = {
            ...req.body,
            instructorId: req.user.id
            // syllabus, includes, etc are handled by Sequelize JSON/Virtuals or body fields matching model
        };

        const course = await Course.create(courseData);

        res.status(201).json({ success: true, data: course });
    } catch (error) {
        console.error("Create Course Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Make sure user is course owner or admin
        if (req.user.role !== 'admin' && String(course.instructorId) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
        }

        await course.update(req.body);

        // Fetch again to return updated
        // const updatedCourse = await Course.findByPk(req.params.id, { include: [...] });

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        console.error("Update Course Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Make sure user is course owner or admin
        if (req.user.role !== 'admin' && String(course.instructorId) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
        }

        await course.destroy();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error("Delete Course Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
