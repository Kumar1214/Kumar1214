const express = require('express');
const router = express.Router();
const Question = require('./Question');
const { protect, authorize } = require('../../shared/middleware/protect');

// @route   GET /api/questions
// @desc    Get all questions
// @access  Private (Any authenticated user)
router.get('/', protect, async (req, res) => {
    try {
        const questions = await Question.findAll({ order: [['createdAt', 'DESC']] });
        res.json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/questions
// @desc    Add a new question
// @access  Private
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const question = await Question.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json({ success: true, data: question });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private
router.put('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const question = await Question.findByPk(req.params.id);
        if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

        if (req.user.role !== 'admin' && String(question.createdBy) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const updated = await question.update(req.body);
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private
router.delete('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const question = await Question.findByPk(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        if (req.user.role !== 'admin' && String(question.createdBy) !== String(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await question.destroy();
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
