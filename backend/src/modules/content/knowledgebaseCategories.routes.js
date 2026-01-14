const express = require('express');
const router = express.Router();
const {
    getKnowledgebaseCategories,
    getKnowledgebaseCategoryById,
    createKnowledgebaseCategory,
    updateKnowledgebaseCategory,
    deleteKnowledgebaseCategory
} = require('./knowledgebaseCategories.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

router.route('/')
    .get(getKnowledgebaseCategories)
    .post(protect, authorize('instructor', 'admin'), createKnowledgebaseCategory);

router.route('/:id')
    .get(getKnowledgebaseCategoryById)
    .put(protect, authorize('instructor', 'admin'), updateKnowledgebaseCategory)
    .delete(protect, authorize('admin', 'instructor'), deleteKnowledgebaseCategory);

module.exports = router;
