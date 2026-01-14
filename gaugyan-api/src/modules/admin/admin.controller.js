const User = require('../identity/User');
const Course = require('../learning/Course');
const Exam = require('../learning/Exam');
const Quiz = require('../learning/Quiz');
const Product = require('../marketplace/Product');

const GaushalaProfile = require('../marketplace/GaushalaProfile');
const Music = require('../entertainment/Music');
const Podcast = require('../entertainment/Podcast');
const Meditation = require('../entertainment/Meditation');
const News = require('../content/News');
const Knowledgebase = require('../content/Knowledgebase');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Admin get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update(req.body);

    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Private (Admin)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: User, as: 'instructor', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Admin get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all exams
// @route   GET /api/admin/exams
// @access  Private (Admin)
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams
    });
  } catch (error) {
    console.error('Admin get exams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all quizzes
// @route   GET /api/admin/quizzes
// @access  Private (Admin)
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    console.error('Admin get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private (Admin)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: User, as: 'vendor', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Admin get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all gaushalas
// @route   GET /api/admin/gaushalas
// @access  Private (Admin)
exports.getGaushalas = async (req, res) => {
  try {
    const gaushalas = await GaushalaProfile.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: gaushalas.length,
      data: gaushalas
    });
  } catch (error) {
    console.error('Admin get gaushalas error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all music
// @route   GET /api/admin/music
// @access  Private (Admin)
exports.getMusic = async (req, res) => {
  try {
    const music = await Music.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: music.length,
      data: music
    });
  } catch (error) {
    console.error('Admin get music error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all podcasts
// @route   GET /api/admin/podcasts
// @access  Private (Admin)
exports.getPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: podcasts.length,
      data: podcasts
    });
  } catch (error) {
    console.error('Admin get podcasts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all meditation
// @route   GET /api/admin/meditation
// @access  Private (Admin)
exports.getMeditation = async (req, res) => {
  try {
    const meditation = await Meditation.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: meditation.length,
      data: meditation
    });
  } catch (error) {
    console.error('Admin get meditation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all news
// @route   GET /api/admin/news
// @access  Private (Admin)
exports.getNews = async (req, res) => {
  try {
    const news = await News.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    console.error('Admin get news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all knowledgebase articles
// @route   GET /api/admin/knowledgebase
// @access  Private (Admin)
exports.getKnowledgebase = async (req, res) => {
  try {
    const articles = await Knowledgebase.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    console.error('Admin get knowledgebase error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {
    const [
      usersCount,
      coursesCount,
      examsCount,
      quizzesCount,
      productsCount,
      gaushalasCount,
      musicCount,
      podcastsCount,
      meditationCount,
      newsCount,
      knowledgebaseCount
    ] = await Promise.all([
      User.count(),
      Course.count(),
      Exam.count(),
      Quiz.count(),
      Product.count(),
      GaushalaProfile.count(),
      Music.count(),
      Podcast.count(),
      Meditation.count(),
      News.count(),
      Knowledgebase.count()
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: usersCount,
        courses: coursesCount,
        exams: examsCount,
        quizzes: quizzesCount,
        products: productsCount,
        gaushalas: gaushalasCount,
        music: musicCount,
        podcasts: podcastsCount,
        meditation: meditationCount,
        news: newsCount,
        knowledgebase: knowledgebaseCount
      }
    });
  } catch (error) {
    console.error('Admin get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};