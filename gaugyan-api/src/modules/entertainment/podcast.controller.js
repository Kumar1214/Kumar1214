const Podcast = require('./Podcast');
const { Op } = require('sequelize');

// @desc    Get all podcasts
// @route   GET /api/podcasts
// @access  Public
exports.getPodcasts = async (req, res) => {
    try {
        const filters = {};
        if (req.query.category && req.query.category !== 'all') filters.category = req.query.category;
        if (req.query.series && req.query.series !== 'all') filters.series = req.query.series;
        if (req.query.status && req.query.status !== 'all') filters.status = req.query.status;

        // Search functionality
        if (req.query.search) {
            filters[Op.or] = [
                { title: { [Op.like]: `%${req.query.search}%` } },
                { description: { [Op.like]: `%${req.query.search}%` } },
                { host: { [Op.like]: `%${req.query.search}%` } }
                // { tags: { [Op.like]: `%${req.query.search}%` } } 
            ];
        }

        const podcasts = await Podcast.findAll({
            where: filters,
            order: [['publishDate', 'DESC']]
        });

        res.status(200).json({ success: true, count: podcasts.length, data: podcasts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single podcast
// @route   GET /api/podcasts/:id
// @access  Public
exports.getPodcastById = async (req, res) => {
    try {
        const podcast = await Podcast.findByPk(req.params.id);
        if (!podcast) return res.status(404).json({ success: false, message: 'Podcast not found' });
        res.status(200).json({ success: true, data: podcast });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new podcast
// @route   POST /api/podcasts
// @access  Private
exports.createPodcast = async (req, res) => {
    try {
        const podcastData = {
            ...req.body,
            uploadedBy: req.user ? req.user.id : 1 // Fallback or strict check
        };

        const podcast = await Podcast.create(podcastData);
        res.status(201).json({ success: true, data: podcast });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update podcast
// @route   PUT /api/podcasts/:id
// @access  Private
exports.updatePodcast = async (req, res) => {
    try {
        let podcast = await Podcast.findByPk(req.params.id);
        if (!podcast) return res.status(404).json({ success: false, message: 'Podcast not found' });

        // Check ownership - only artist who uploaded podcast or admin can update
        // Assuming req.user is available
        if (req.user && req.user.role !== 'admin' && podcast.uploadedBy !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this podcast' });
        }

        podcast = await podcast.update(req.body);

        res.status(200).json({ success: true, data: podcast });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete podcast
// @route   DELETE /api/podcasts/:id
// @access  Private
exports.deletePodcast = async (req, res) => {
    try {
        const podcast = await Podcast.findByPk(req.params.id);
        if (!podcast) return res.status(404).json({ success: false, message: 'Podcast not found' });

        // Check ownership
        if (req.user && req.user.role !== 'admin' && podcast.uploadedBy !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this podcast' });
        }

        await podcast.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
