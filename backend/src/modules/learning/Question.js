const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('multiple-choice', 'true-false', 'essay', 'short-answer', 'fill-in-the-blank'),
        defaultValue: 'multiple-choice'
    },
    options: {
        type: DataTypes.JSON, // Array of option strings
        defaultValue: []
    },
    correctAnswer: {
        type: DataTypes.STRING, // Index or actual value
        allowNull: true
    },
    explanation: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    difficulty: {
        type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
        defaultValue: 'Medium'
    },
    marks: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    attachment: {
        type: DataTypes.STRING, // URL to attached file (PDF, image, etc.)
        allowNull: true
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

Question.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = Question;
