const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const NewsCategory = sequelize.define('NewsCategory', {
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
    description: DataTypes.STRING,
    icon: DataTypes.STRING
}, {
    timestamps: true
});

module.exports = NewsCategory;
