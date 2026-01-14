const Meditation = require('./Meditation');
const { Op } = require('sequelize');

// @desc    Get all meditations
// @route   GET /api/meditation
// @access  Public
exports.getMeditations = async (req, res) => {
    try {
        const filters = {};
        if (req.query.type && req.query.type !== 'all') filters.type = req.query.type;
        if (req.query.difficulty && req.query.difficulty !== 'all') filters.difficulty = req.query.difficulty;
        if (req.query.status && req.query.status !== 'all') filters.status = req.query.status;

        // Search functionality
        if (req.query.search) {
            filters[Op.or] = [
                { title: { [Op.like]: `%${req.query.search}%` } },
                { type: { [Op.like]: `%${req.query.search}%` } },
                { instructor: { [Op.like]: `%${req.query.search}%` } }
                // { tags: { [Op.like]: `%${req.query.search}%` } } 
            ];
        }

        const meditations = await Meditation.findAll({
            where: filters,
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, count: meditations.length, data: meditations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single meditation
// @route   GET /api/meditation/:id
// @access  Public
exports.getMeditationById = async (req, res) => {
    try {
        const meditation = await Meditation.findByPk(req.params.id);
        if (!meditation) return res.status(404).json({ success: false, message: 'Meditation not found' });
        res.status(200).json({ success: true, data: meditation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new meditation
// @route   POST /api/meditation
// @access  Private
exports.createMeditation = async (req, res) => {
    try {
        const meditationData = {
            ...req.body,
            uploadedBy: req.user ? req.user.id : 1 // Fallback or strict check
        };

        const meditation = await Meditation.create(meditationData);
        res.status(201).json({ success: true, data: meditation });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update meditation
// @route   PUT /api/meditation/:id
// @access  Private
exports.updateMeditation = async (req, res) => {
    try {
        let meditation = await Meditation.findByPk(req.params.id);
        if (!meditation) return res.status(404).json({ success: false, message: 'Meditation not found' });

        // Check ownership - only artist who uploaded meditation or admin can update
        if (req.user && req.user.role !== 'admin' && meditation.uploadedBy !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this meditation' });
        }

        meditation = await meditation.update(req.body);

        res.status(200).json({ success: true, data: meditation });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete meditation
// @route   DELETE /api/meditation/:id
// @access  Private
exports.deleteMeditation = async (req, res) => {
    try {
        const meditation = await Meditation.findByPk(req.params.id);
        if (!meditation) return res.status(404).json({ success: false, message: 'Meditation not found' });

        // Check ownership - only artist who uploaded meditation or admin can delete
        if (req.user && req.user.role !== 'admin' && meditation.uploadedBy !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this meditation' });
        }

        await meditation.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
