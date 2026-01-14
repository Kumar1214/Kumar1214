const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const MeditationCategory = sequelize.define('MeditationCategory', {
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
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    timestamps: true
});

module.exports = MeditationCategory;
