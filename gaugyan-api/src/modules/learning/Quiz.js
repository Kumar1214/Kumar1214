console.log('LOADING QUIZ MODEL');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');
const Course = require('./Course');

const Quiz = sequelize.define('Quiz', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: DataTypes.TEXT,
    courseId: {
        type: DataTypes.INTEGER,
        references: {
            model: Course,
            key: 'id'
        }
    },
    chapter: DataTypes.STRING,
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
        allowNull: false
    },
    questions: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    timeLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    passingScore: {
        type: DataTypes.INTEGER,
        defaultValue: 60
    },
    allowRetake: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    showCorrectAnswers: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    randomizeQuestions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    randomizeOptions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    attempts: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    totalAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    averageScore: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    studyMaterial: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    prizes: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    winners: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    shares: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bookmarks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    averageCompletionTime: {
        type: DataTypes.INTEGER, // in seconds
        defaultValue: 0
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: (quiz) => {
            if (quiz.questions && Array.isArray(quiz.questions)) {
                quiz.totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 10), 0);
            }
            if (quiz.attempts && Array.isArray(quiz.attempts) && quiz.attempts.length > 0) {
                const totalScore = quiz.attempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0);
                quiz.averageScore = totalScore / quiz.attempts.length;
                quiz.totalAttempts = quiz.attempts.length;
            }
        }
    }
});

Quiz.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Quiz.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

module.exports = Quiz;
