const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    permissions: {
        type: DataTypes.JSON, // Stores the permission matrix
        defaultValue: {}
    },
    isSystem: {
        type: DataTypes.BOOLEAN, // Prevent deletion of core roles (Admin, User)
        defaultValue: false
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: '#6B7280'
    },
    usersCount: { // Virtual or cached count could be useful, but for now just validation
        type: DataTypes.VIRTUAL,
        get() {
            // Placeholder: In a real app, this would query User table count
            return 0;
        }
    }
}, {
    timestamps: true
});

module.exports = Role;
