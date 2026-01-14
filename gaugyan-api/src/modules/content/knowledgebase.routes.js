const express = require('express');
const router = express.Router();
const {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = require('./knowledgebase.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

router.route('/')
    .get(getArticles)
    .post(protect, authorize('instructor', 'admin'), createArticle);

router.route('/:id')
    .get(getArticleById)
    .put(protect, authorize('instructor', 'admin'), updateArticle)
    .delete(protect, authorize('admin'), deleteArticle);

module.exports = router;
