const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const QuestionBank = sequelize.define('QuestionBank', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    uploadDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

QuestionBank.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = QuestionBank;
