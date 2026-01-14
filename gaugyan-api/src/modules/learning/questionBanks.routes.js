const express = require('express');
const router = express.Router();
const QuestionBank = require('./QuestionBank');
const { protect, authorize } = require('../../shared/middleware/protect');

// @route   GET /api/question-banks
// @desc    Get all question banks
// @access  Public
router.get('/', async (req, res) => {
    try {
        const questionBanks = await QuestionBank.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: questionBanks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/question-banks
// @desc    Create a question bank
// @access  Private
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const questionBank = await QuestionBank.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json({ success: true, data: questionBank });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/question-banks/:id
// @desc    Update a question bank
// @access  Private
router.put('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const questionBank = await QuestionBank.findByPk(req.params.id);
        if (!questionBank) return res.status(404).json({ success: false, message: 'Question bank not found' });

        if (req.user.role !== 'admin' && String(questionBank.createdBy) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const updated = await questionBank.update(req.body);
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/question-banks/:id
// @desc    Delete a question bank
// @access  Private
router.delete('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const questionBank = await QuestionBank.findByPk(req.params.id);
        if (!questionBank) return res.status(404).json({ success: false, message: 'Question bank not found' });

        if (req.user.role !== 'admin' && String(questionBank.createdBy) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await questionBank.destroy();
        res.json({ success: true, message: 'Question bank deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
