const Meeting = require('./Meeting');
const asyncHandler = require('../../shared/middleware/asyncHandler');

// @desc    Get all meetings
// @route   GET /api/education/meetings
// @access  Private/Admin
exports.getMeetings = asyncHandler(async (req, res) => {
    const meetings = await Meeting.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: meetings });
});

// @desc    Create meeting
// @route   POST /api/education/meetings
// @access  Private/Admin
exports.createMeeting = asyncHandler(async (req, res) => {
    const meeting = await Meeting.create(req.body);
    res.status(201).json({ success: true, data: meeting });
});

// @desc    Update meeting
// @route   PUT /api/education/meetings/:id
// @access  Private/Admin
exports.updateMeeting = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }
    await meeting.update(req.body);
    res.json({ success: true, data: meeting });
});

// @desc    Delete meeting
// @route   DELETE /api/education/meetings/:id
// @access  Private/Admin
exports.deleteMeeting = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }
    await meeting.destroy();
    res.json({ success: true, message: 'Meeting deleted' });
});
