const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const MusicCategory = sequelize.define('MusicCategory', {
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

module.exports = MusicCategory;
