const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getCourses,
  getExams,
  getQuizzes,
  getProducts,
  getGaushalas,
  getMusic,
  getPodcasts,
  getMeditation,
  getNews,
  getKnowledgebase,
  getStats
} = require('./admin.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

// All admin routes require authentication and admin authorization
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getStats);

// Custom Analytics
const { getAnalytics } = require('./analytics.controller');
router.get('/analytics', getAnalytics);

// AI Dashboard Summary
const { getAISummary } = require('./ai.controller');
router.get('/ai-summary', getAISummary);

// User management routes
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Content management routes
router.get('/courses', getCourses);
router.get('/exams', getExams);
router.get('/quizzes', getQuizzes);
router.get('/products', getProducts);
router.get('/gaushalas', getGaushalas);
router.get('/music', getMusic);
router.get('/podcasts', getPodcasts);
router.get('/meditation', getMeditation);
router.get('/news', getNews);
router.get('/knowledgebase', getKnowledgebase);

module.exports = router;