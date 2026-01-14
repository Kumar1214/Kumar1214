const Music = require('./Music');
const Podcast = require('./Podcast');
const Meditation = require('./Meditation');
const { sequelize } = require('../../shared/config/database');

// @desc    Get dashboard stats for artist
// @route   GET /api/entertainment/dashboard/stats
// @access  Private (Artist)
exports.getEntertainmentStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const musicStats = await Music.findAll({
      where: { uploadedBy: userId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.col('playCount')), 'views'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ]
    });

    const podcastStats = await Podcast.findAll({
      where: { uploadedBy: userId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.col('playCount')), 'views'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ]
    });

    const meditationStats = await Meditation.findAll({
      where: { uploadedBy: userId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.col('playCount')), 'views'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ]
    });

    const mStats = musicStats[0]?.dataValues || { total: 0, views: 0, likes: 0 };
    const pStats = podcastStats[0]?.dataValues || { total: 0, views: 0, likes: 0 };
    const medStats = meditationStats[0]?.dataValues || { total: 0, views: 0, likes: 0 };

    res.status(200).json({
      success: true,
      data: {
        music: {
          total: parseInt(mStats.total || 0),
          views: parseInt(mStats.views || 0),
          likes: parseInt(mStats.likes || 0)
        },
        podcasts: {
          total: parseInt(pStats.total || 0),
          views: parseInt(pStats.views || 0),
          likes: parseInt(pStats.likes || 0)
        },
        meditation: {
          total: parseInt(medStats.total || 0),
          views: parseInt(medStats.views || 0),
          likes: parseInt(medStats.likes || 0)
        },
        totalViews: parseInt(mStats.views || 0) + parseInt(pStats.views || 0) + parseInt(medStats.views || 0),
        totalLikes: parseInt(mStats.likes || 0) + parseInt(pStats.likes || 0) + parseInt(medStats.likes || 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all music uploaded by artist
// @route   GET /api/entertainment/music
// @access  Private (Artist)
exports.getArtistMusic = async (req, res) => {
  try {
    const music = await Music.findAll({
      where: { uploadedBy: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: music.length, data: music });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all podcasts uploaded by artist
// @route   GET /api/entertainment/podcasts
// @access  Private (Artist)
exports.getArtistPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.findAll({
      where: { uploadedBy: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: podcasts.length, data: podcasts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all meditations uploaded by artist
// @route   GET /api/entertainment/meditation
// @access  Private (Artist)
exports.getArtistMeditation = async (req, res) => {
  try {
    const meditations = await Meditation.findAll({
      where: { uploadedBy: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: meditations.length, data: meditations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};