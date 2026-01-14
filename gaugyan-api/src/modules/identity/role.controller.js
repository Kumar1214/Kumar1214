const Role = require('./Role');
const User = require('./User'); // To check usage if needed

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json({ success: true, data: roles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new role
// @route   POST /api/roles
// @access  Private/Admin
exports.createRole = async (req, res) => {
    try {
        const { name, permissions, color } = req.body;

        const roleExists = await Role.findOne({ where: { name } });
        if (roleExists) {
            return res.status(400).json({ success: false, message: 'Role already exists' });
        }

        const role = await Role.create({
            name,
            permissions,
            color,
            isSystem: false
        });

        res.status(201).json({ success: true, data: role });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private/Admin
exports.updateRole = async (req, res) => {
    try {
        let role = await Role.findByPk(req.params.id);

        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        // Prevent changing name of system roles to avoid breaking code references
        if (role.isSystem && req.body.name && req.body.name !== role.name) {
            return res.status(400).json({ success: false, message: 'Cannot rename system roles' });
        }

        role = await role.update(req.body);

        res.status(200).json({ success: true, data: role });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);

        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        if (role.isSystem) {
            return res.status(400).json({ success: false, message: 'Cannot delete system roles' });
        }

        await role.destroy();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
