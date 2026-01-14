const Music = require('./Music');
const { Op } = require('sequelize');

// @desc    Get all music tracks
// @route   GET /api/music
// @access  Public
exports.getMusic = async (req, res) => {
    try {
        const filters = {};
        if (req.query.genre && req.query.genre !== 'all') filters.genre = req.query.genre;
        if (req.query.mood && req.query.mood !== 'all') filters.mood = req.query.mood;
        if (req.query.status && req.query.status !== 'all') filters.status = req.query.status;
        if (req.query.uploadedBy) filters.uploadedBy = req.query.uploadedBy;

        // Status security logic
        if (req.query.status && req.query.status !== 'all') {
            filters.status = req.query.status;
        } else {
            // Default visibility: Approved/Active only
            // Unless Admin or requesting own tracks
            const requestingOwn = req.user && req.query.uploadedBy && String(req.query.uploadedBy) === String(req.user.id);
            const isAdmin = req.user && req.user.role === 'admin';

            if (!isAdmin && !requestingOwn) {
                filters.status = 'approved';
            }
        }
        if (req.query.search) {
            filters[Op.or] = [
                { title: { [Op.like]: `%${req.query.search}%` } },
                { artist: { [Op.like]: `%${req.query.search}%` } }
                // { tags: { [Op.like]: `%${req.query.search}%` } } // Search in JSON tags might need special handling or ignore for now
            ];
        }

        const tracks = await Music.findAll({
            where: filters,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, count: tracks.length, data: tracks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single music track
// @route   GET /api/music/:id
// @access  Public
exports.getMusicById = async (req, res) => {
    try {
        const track = await Music.findByPk(req.params.id);
        if (!track) return res.status(404).json({ success: false, message: 'Track not found' });
        res.status(200).json({ success: true, data: track });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new music track
// @route   POST /api/music
// @access  Private
exports.createMusic = async (req, res) => {
    try {
        // TODO: Validate req.user exists. 
        // For migration debug, we assume user is passed if auth middleware works.
        // We might need to ensure uploadedBy is an ID (integer) if we switch user IDs to int.

        const trackData = {
            ...req.body,
            uploadedBy: req.user ? req.user.id : 1 // Fallback or strict check
        };

        const track = await Music.create(trackData);
        res.status(201).json({ success: true, data: track });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update music track
// @route   PUT /api/music/:id
// @access  Private
exports.updateMusic = async (req, res) => {
    try {
        let track = await Music.findByPk(req.params.id);
        if (!track) return res.status(404).json({ success: false, message: 'Track not found' });

        // Check ownership - only artist who uploaded track or admin can update
        // req.user.id usage implies we are using Sequelize User model where id is int (or string matches)
        // If uploadedBy is int, we compare strictly.
        // Assuming req.user is populated by middleware.
        if (req.user && req.user.role !== 'admin' && track.uploadedBy !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this track' });
        }

        track = await track.update(req.body);

        res.status(200).json({ success: true, data: track });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete music track
// @route   DELETE /api/music/:id
// @access  Private
exports.deleteMusic = async (req, res) => {
    try {
        const track = await Music.findByPk(req.params.id);
        if (!track) return res.status(404).json({ success: false, message: 'Track not found' });

        // Check ownership - only artist who uploaded track or admin can delete
        if (req.user && req.user.role !== 'admin' && track.uploadedBy !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this track' });
        }

        await track.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
