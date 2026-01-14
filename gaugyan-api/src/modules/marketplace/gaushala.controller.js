const GaushalaProfile = require('./GaushalaProfile');
const { Op } = require('sequelize');

// @desc    Get all gaushalas
// @route   GET /api/gaushalas
// @access  Public
exports.getGaushalas = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const offset = (page - 1) * limit;

        const where = {};

        // Search Filters
        if (req.query.city) {
            where.city = { [Op.like]: `%${req.query.city}%` };
        }
        if (req.query.state) {
            where.state = { [Op.like]: `%${req.query.state}%` };
        }
        if (req.query.name) {
            where.name = { [Op.like]: `%${req.query.name}%` };
        }
        if (req.query.ownerId) {
            where.ownerId = req.query.ownerId;
        }
        if (req.query.location) {
            const loc = req.query.location;
            where[Op.or] = [
                { city: { [Op.like]: `%${loc}%` } },
                { state: { [Op.like]: `%${loc}%` } },
                { address: { [Op.like]: `%${loc}%` } },
                { name: { [Op.like]: `%${loc}%` } }
            ];
        }

        const { count, rows } = await GaushalaProfile.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        const pagination = {};
        if (offset + limit < count) {
            pagination.next = { page: page + 1, limit };
        }
        if (offset > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count,
            pagination,
            data: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single gaushala
// @route   GET /api/gaushalas/:id
// @access  Public
exports.getGaushala = async (req, res) => {
    try {
        const gaushala = await GaushalaProfile.findByPk(req.params.id);

        if (!gaushala) {
            return res.status(404).json({ success: false, message: `Gaushala not found with id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: gaushala });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new gaushala
// @route   POST /api/gaushalas
// @access  Private
exports.createGaushala = async (req, res) => {
    try {
        // Simple mapping, add ownerID
        const gaushalaData = {
            ...req.body,
            ownerId: req.user ? req.user.id : null
        };

        // Ensure some defaults if needed, or rely on model defaults
        if (req.body.cows) gaushalaData.cowsCount = req.body.cows;
        if (req.body.staff) gaushalaData.staffCount = req.body.staff;

        const gaushala = await GaushalaProfile.create(gaushalaData);

        res.status(201).json({
            success: true,
            data: gaushala
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update gaushala
// @route   PUT /api/gaushalas/:id
// @access  Private
exports.updateGaushala = async (req, res) => {
    try {
        let gaushala = await GaushalaProfile.findByPk(req.params.id);

        if (!gaushala) {
            return res.status(404).json({ success: false, message: `Gaushala not found with id of ${req.params.id}` });
        }

        // Check ownership - only owner or admin can update
        // user.id in sequelize is integer, ownerId is integer
        if (req.user.role !== 'admin' && gaushala.ownerId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this gaushala' });
        }

        // Map updates
        const updateData = { ...req.body };
        if (req.body.cows) updateData.cowsCount = req.body.cows;

        gaushala = await gaushala.update(updateData);

        res.status(200).json({ success: true, data: gaushala });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete gaushala
// @route   DELETE /api/gaushalas/:id
// @access  Private
exports.deleteGaushala = async (req, res) => {
    try {
        const gaushala = await GaushalaProfile.findByPk(req.params.id);

        if (!gaushala) {
            return res.status(404).json({ success: false, message: `Gaushala not found with id of ${req.params.id}` });
        }

        // Check ownership
        if (req.user.role !== 'admin' && gaushala.ownerId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this gaushala' });
        }

        await gaushala.destroy();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
