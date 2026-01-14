const express = require('express');
const router = express.Router();
const Quiz = require('./Quiz');
const { protect, authorize } = require('../../shared/middleware/protect');

// @route   GET /api/quizzes
// @desc    Get all quizzes
// @access  Public
// Debug route to check schema from running server


router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message, sql: error.sql });
    }
});

// @route   GET /api/quizzes/:id
// @desc    Get single quiz
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/quizzes
// @desc    Create a quiz
// @access  Private
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const quizData = {
            ...req.body,
            createdBy: req.user.id,
            questions: req.body.questions || [],
            attempts: []
        };
        const quiz = await Quiz.create(quizData);
        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/quizzes/:id
// @desc    Update a quiz
// @access  Private
router.put('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        // Check ownership
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        if (req.user.role !== 'admin' && String(quiz.createdBy) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this quiz' });
        }

        const updatedQuiz = await quiz.update(req.body);
        res.json(updatedQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const Result = require('./Result');

// ... (existing imports)

// @route   POST /api/quizzes/:id/submit
// @desc    Submit a quiz attempt
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
    try {
        const { answers } = req.body; // Array of { questionId, selectedOption }
        const quiz = await Quiz.findByPk(req.params.id);

        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let score = 0;
        let totalPoints = 0;
        const processedAnswers = [];

        // Calculate Score
        if (quiz.questions && Array.isArray(quiz.questions)) {
            quiz.questions.forEach(q => {
                const points = q.points || 10; // Default 10 points per question
                totalPoints += points;

                const userAnswer = answers.find(a => a.questionId === q.id);
                const isCorrect = userAnswer && String(userAnswer.selectedOption) === String(q.correctAnswer);

                if (isCorrect) {
                    score += points;
                }

                processedAnswers.push({
                    questionId: q.id,
                    selectedOption: userAnswer ? userAnswer.selectedOption : null,
                    isCorrect
                });
            });
        }

        const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
        const status = percentage >= (quiz.passingScore || 60) ? 'passed' : 'failed';

        // 1. Save to Result Table
        const result = await Result.create({
            userId: req.user.id,
            itemId: quiz.id,
            type: 'quiz',
            title: quiz.title,
            score,
            totalPoints,
            percentage,
            answers: processedAnswers,
            status
        });

        // 2. Legacy Support: Update Quiz.attempts (Optional, but good for aggregate stats)
        const attemptRecord = {
            userId: req.user.id,
            score,
            percentage,
            date: new Date()
        };

        let attempts = quiz.attempts || [];
        // Ensure it's an array (SQLite JSON parsing safety)
        if (typeof attempts === 'string') {
            try { attempts = JSON.parse(attempts); } catch (e) { attempts = []; }
        }

        attempts.push(attemptRecord);

        await quiz.update({
            attempts: attempts,
            // Recalculate averages directly if needed or let hooks handle it
        });

        res.json({ success: true, data: result });

    } catch (error) {
        console.error('Quiz Submit Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/quizzes/my-results
// @desc    Get current user's quiz results
// @access  Private
router.get('/my-results', protect, async (req, res) => {
    try {
        const results = await Result.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            // Include Quiz title if needed, though Result has a title copy
        });
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz
// @access  Private
router.delete('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        // Check ownership
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        if (req.user.role !== 'admin' && String(quiz.createdBy) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this quiz' });
        }

        await quiz.destroy();
        res.json({ message: 'Quiz deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
