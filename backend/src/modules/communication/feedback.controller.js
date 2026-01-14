const Feedback = require('./Feedback');
const asyncHandler = require('../../shared/middleware/asyncHandler');
const ErrorResponse = require('../../shared/utils/errorResponse');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
exports.createFeedback = asyncHandler(async (req, res) => {
    const { name, email, subject, message, category, rating } = req.body;

    const feedback = await Feedback.create({
        name,
        email,
        subject,
        message,
        category,
        rating,
        status: 'new'
    });

    res.status(201).json({
        success: true,
        data: feedback
    });
});

// @desc    Get all feedback
// @route   GET /api/admin/feedback
// @access  Private/Admin
exports.getFeedbacks = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) {
        where.status = req.query.status;
    }

    const { count, rows } = await Feedback.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        success: true,
        count: count,
        pagination: {
            total: count,
            page,
            pages: Math.ceil(count / limit)
        },
        data: rows
    });
});

// @desc    Update feedback status
// @route   PUT /api/admin/feedback/:id
// @access  Private/Admin
exports.updateFeedbackStatus = asyncHandler(async (req, res, next) => {
    const feedback = await Feedback.findByPk(req.params.id);

    if (!feedback) {
        return next(new ErrorResponse(`Feedback not found with id of ${req.params.id}`, 404));
    }

    await feedback.update(req.body);

    res.status(200).json({
        success: true,
        data: feedback
    });
});

// @desc    Delete feedback
// @route   DELETE /api/admin/feedback/:id
// @access  Private/Admin
exports.deleteFeedback = asyncHandler(async (req, res, next) => {
    const feedback = await Feedback.findByPk(req.params.id);

    if (!feedback) {
        return next(new ErrorResponse(`Feedback not found with id of ${req.params.id}`, 404));
    }

    await feedback.destroy();

    res.status(200).json({
        success: true,
        data: {}
    });
});
