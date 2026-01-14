const express = require('express');
const router = express.Router();
const {
    getNewsCategories,
    getNewsCategoryById,
    createNewsCategory,
    updateNewsCategory,
    deleteNewsCategory
} = require('./newsCategories.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

router.route('/')
    .get(getNewsCategories)
    .post(protect, authorize('editor', 'admin', 'instructor'), createNewsCategory);

router.route('/:id')
    .get(getNewsCategoryById)
    .put(protect, authorize('editor', 'admin', 'instructor'), updateNewsCategory)
    .delete(protect, authorize('admin', 'editor'), deleteNewsCategory);

module.exports = router;
