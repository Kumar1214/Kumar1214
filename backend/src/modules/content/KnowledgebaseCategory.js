const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const KnowledgebaseCategory = sequelize.define('KnowledgebaseCategory', {
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

module.exports = KnowledgebaseCategory;
