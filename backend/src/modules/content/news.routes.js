const express = require('express');
const router = express.Router();
const {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
} = require('./news.controller');
const { protect, authorize } = require('../../shared/middleware/protect');
const { fetchExternalNews } = require('../../shared/services/news.service');

// Get external news
router.get('/external', async (req, res) => {
    try {
        const { category, pageSize, q, page } = req.query;
        const news = await fetchExternalNews({ category, pageSize, q, page });
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.route('/')
    .get(getNews)
    .post(protect, authorize('editor', 'admin'), createNews);

router.route('/:id')
    .get(getNewsById)
    .put(protect, authorize('editor', 'admin'), updateNews)
    .delete(protect, authorize('admin'), deleteNews);

module.exports = router;
