const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');
const Quiz = require('./Quiz');

const Result = sequelize.define('Result', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('quiz', 'exam'),
        defaultValue: 'quiz'
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    totalPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    percentage: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    answers: {
        type: DataTypes.JSON,
        defaultValue: [] // [{ questionId, selectedOption, isCorrect }]
    },
    status: {
        type: DataTypes.ENUM('passed', 'failed', 'completed'),
        defaultValue: 'completed'
    },
    attemptDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true
});

Result.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Result.belongsTo(Quiz, { foreignKey: 'itemId', constraints: false, as: 'quiz' });

module.exports = Result;
