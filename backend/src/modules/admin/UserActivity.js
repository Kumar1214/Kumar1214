const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const UserActivity = sequelize.define('UserActivity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nullable for guests
        references: {
            model: User,
            key: 'id'
        }
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    method: {
        type: DataTypes.STRING, // GET, POST, etc.
        allowNull: true
    },
    route: {
        type: DataTypes.STRING, // /api/courses, /login, etc.
        allowNull: false
    },
    userAgent: {
        type: DataTypes.TEXT, // Browser/Device info
        allowNull: true
    },
    location: {
        type: DataTypes.JSON, // { city, country, region }
        allowNull: true
    },
    statusCode: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER, // Response time in ms
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['createdAt'] },
        { fields: ['userId'] },
        { fields: ['route'] }
    ]
});

// Association
UserActivity.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = UserActivity;
