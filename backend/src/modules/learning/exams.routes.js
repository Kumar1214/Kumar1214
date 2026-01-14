const express = require('express');
const router = express.Router();
const Exam = require('./Exam');
const { protect, authorize } = require('../../shared/middleware/protect');

// @route   GET /api/exams
// @desc    Get all exams
// @access  Public
router.get('/', async (req, res) => {
    try {
        const exams = await Exam.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/exams/:id
// @desc    Get single exam
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const exam = await Exam.findByPk(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/exams
// @desc    Create an exam
// @access  Private
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const examData = {
            ...req.body,
            createdBy: req.user.id,
            questions: req.body.questions || [],
            instructions: req.body.instructions || [],
            prizes: req.body.prizes || [],
            winners: req.body.winners || []
        };
        const exam = await Exam.create(examData);
        res.status(201).json({ success: true, data: exam });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/exams/:id
// @desc    Update an exam
// @access  Private
router.put('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        // Check ownership
        const exam = await Exam.findByPk(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        if (req.user.role !== 'admin' && String(exam.createdBy) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this exam' });
        }

        const updatedExam = await exam.update(req.body);
        res.json(updatedExam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/exams/:id
// @desc    Delete an exam
// @access  Private
router.delete('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        // Check ownership
        const exam = await Exam.findByPk(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        if (req.user.role !== 'admin' && String(exam.createdBy) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this exam' });
        }

        await exam.destroy();
        res.json({ message: 'Exam deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
