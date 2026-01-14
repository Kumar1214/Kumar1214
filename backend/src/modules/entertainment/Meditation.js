const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Meditation = sequelize.define('Meditation', {
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
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    audioUrl: {
        type: DataTypes.STRING
    },
    videoUrl: {
        type: DataTypes.STRING
    },
    coverImage: {
        type: DataTypes.STRING,
        defaultValue: 'default-meditation-cover.jpg'
    },
    instructor: {
        type: DataTypes.STRING
    },
    series: {
        type: DataTypes.STRING
    },
    benefits: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    sessions: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    instructions: {
        type: DataTypes.TEXT
    },
    playCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    numRatings: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived', 'pending'),
        defaultValue: 'pending'
    },
    tags: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: 'Hindi'
    },
    completions: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    shares: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bookmarks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    averageDuration: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bookmarkedBy: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    shareHistory: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    uploadedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

Meditation.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

module.exports = Meditation;
