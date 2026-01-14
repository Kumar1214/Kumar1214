const Cow = require('./Cow');
const GaushalaProfile = require('./GaushalaProfile');
const asyncHandler = require('../../shared/middleware/asyncHandler');
const { Op } = require('sequelize');

// @desc    Get all cows
// @route   GET /api/cows
// @access  Public
exports.getCows = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const offset = (page - 1) * limit;

        // Build Where Clause
        const where = {};

        if (req.query.breed) {
            where.breed = { [Op.like]: `%${req.query.breed}%` };
        }
        if (req.query.name) {
            where.name = { [Op.like]: `%${req.query.name}%` };
        }
        if (req.query.gaushalaName) {
            // This is trickier in SQL if it's not a direct column. 
            // Assuming it's joined or we filter by association. 
            // For now, let's assume strict filtering or omitted if complex.
        }

        const { count, rows } = await Cow.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: GaushalaProfile,
                    as: 'gaushalaProfile', // Ensure association alias matches
                    attributes: ['name', 'city', 'state']
                }
            ]
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
            count: rows.length,
            total: count,
            pagination,
            data: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Get single cow
// @route   GET /api/cows/:id
// @access  Public
exports.getCow = asyncHandler(async (req, res) => {
    try {
        const cow = await Cow.findByPk(req.params.id, {
            include: [
                {
                    model: GaushalaProfile,
                    attributes: ['name', 'city', 'state', 'address', 'phone', 'email']
                }
            ]
        });

        if (!cow) {
            return res.status(404).json({ success: false, message: `Cow not found with id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: cow });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Create new cow
// @route   POST /api/cows
// @access  Private (gaushala_owner, admin)
exports.createCow = asyncHandler(async (req, res) => {
    try {
        // Check for published gaushala
        const publishedGaushala = await GaushalaProfile.findOne({ where: { owner: req.user.id } });

        // If not admin, gaushala must belong to user
        if (req.user.role !== 'admin' && !publishedGaushala) {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has not created a gaushala yet`
            });
        }

        const cowData = { ...req.body, ownerId: req.user.id };

        if (publishedGaushala && req.user.role !== 'admin') {
            cowData.gaushalaProfileId = publishedGaushala.id;
        }

        const cow = await Cow.create(cowData);

        res.status(201).json({
            success: true,
            data: cow
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Update cow
// @route   PUT /api/cows/:id
// @access  Private (gaushala_owner, admin)
exports.updateCow = asyncHandler(async (req, res) => {
    try {
        let cow = await Cow.findByPk(req.params.id);

        if (!cow) {
            return res.status(404).json({ success: false, message: `Cow not found with id of ${req.params.id}` });
        }

        // Check ownership
        if (req.user.role !== 'admin' && cow.ownerId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this cow' });
        }

        cow = await cow.update(req.body);

        res.status(200).json({ success: true, data: cow });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Delete cow
// @route   DELETE /api/cows/:id
// @access  Private (gaushala_owner, admin)
exports.deleteCow = asyncHandler(async (req, res) => {
    try {
        const cow = await Cow.findByPk(req.params.id);

        if (!cow) {
            return res.status(404).json({ success: false, message: `Cow not found with id of ${req.params.id}` });
        }

        // Check ownership
        if (req.user.role !== 'admin' && cow.ownerId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this cow' });
        }

        await cow.destroy();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Adopt a cow
// @route   POST /api/cows/:id/adopt
// @access  Private (authenticated users)
exports.adoptCow = asyncHandler(async (req, res) => {
    try {
        const cow = await Cow.findByPk(req.params.id);

        if (!cow) {
            return res.status(404).json({ success: false, message: `Cow not found with id of ${req.params.id}` });
        }

        if (cow.adoptionStatus !== 'available' && cow.adoptionStatus !== null) { // null check added
            return res.status(400).json({
                success: false,
                message: `Cow is not available for adoption. Current status: ${cow.adoptionStatus}`
            });
        }

        // Simulating adoption logic - in SQL we might use a separate Adoption table or JSON field
        // Cow model has `adoptedBy`, `adoptionDate`, `adoptionStatus`

        await cow.update({
            adoptionStatus: 'adopted',
            adoptedBy: req.user.id,
            adoptionDate: new Date()
        });

        res.status(200).json({
            success: true,
            data: cow,
            message: 'Cow adopted successfully!'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Get cows by gaushala
// @route   GET /api/gaushalas/:gaushalaId/cows
// @access  Public
exports.getCowsByGaushala = asyncHandler(async (req, res) => {
    try {
        const cows = await Cow.findAll({ where: { gaushalaProfileId: req.params.gaushalaId } });

        res.status(200).json({
            success: true,
            count: cows.length,
            data: cows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});