const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('./course.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

// @route   GET /api/courses
// @desc    Get all courses (with filtering/search)
// @access  Public
router.get('/', getCourses);

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', getCourse);

// @route   POST /api/courses
// @desc    Create a course
// @access  Private (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), createCourse);

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private (Instructor/Admin)
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (Instructor/Admin)
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
