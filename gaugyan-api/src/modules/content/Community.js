const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const Community = sequelize.define('Community', {
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
    description: {
        type: DataTypes.TEXT
    },
    icon: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.ENUM('public', 'private', 'pro_only'),
        defaultValue: 'public'
    },
    subscriberCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = Community;
