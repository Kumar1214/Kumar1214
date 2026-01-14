const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');
const Course = require('./Course');

const Exam = sequelize.define('Exam', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    courseId: {
        type: DataTypes.INTEGER,
        references: {
            model: Course,
            key: 'id'
        }
    },
    category: {
        type: DataTypes.STRING, // Using STRING to allow generic values if enum changes
        allowNull: false
    },
    level: {
        type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
        defaultValue: 'Beginner'
    },
    difficulty: {
        type: DataTypes.ENUM('Easy', 'Medium', 'Hard', 'Intermediate'),
        defaultValue: 'Medium'
    },
    questions: {
        type: DataTypes.JSON, // Array of question objects
        defaultValue: []
    },
    duration: {
        type: DataTypes.INTEGER, // minutes
        allowNull: false
    },
    totalMarks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    passingMarks: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: 'https://placehold.co/600x400'
    },
    startDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    endDate: DataTypes.DATE,
    resultDate: DataTypes.DATE,
    participants: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    instructions: {
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
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    attempts: {
        type: DataTypes.JSON, // Detailed array of user attempts
        defaultValue: []
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
    topics: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    requirements: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    totalAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    passCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    failCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    averageScore: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    shares: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bookmarks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: (exam) => {
            // Recalculate total marks if questions changed
            // Note: Sequelize hooks on updates might differ, check if 'questions' is in data values
            if (exam.questions && Array.isArray(exam.questions)) {
                exam.totalMarks = exam.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
            }
        }
    }
});

Exam.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Exam.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

module.exports = Exam;
