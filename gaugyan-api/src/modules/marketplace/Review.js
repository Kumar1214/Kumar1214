const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    targetType: {
        type: DataTypes.ENUM('product', 'course', 'artist'),
        allowNull: false
    },
    targetId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    // AI Fields
    aiFlagged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    aiConfidence: {
        type: DataTypes.FLOAT, // 0 to 1
        defaultValue: 0
    },
    aiReason: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

Review.belongsTo(User, { foreignKey: 'userId' });

module.exports = Review;
