const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Podcast = sequelize.define('Podcast', {
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
    series: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    host: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guest: {
        type: DataTypes.STRING
    },
    audioUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coverArt: {
        type: DataTypes.STRING,
        defaultValue: 'default-podcast-cover.jpg'
    },
    youtubeUrl: {
        type: DataTypes.STRING
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    episodeNumber: {
        type: DataTypes.INTEGER
    },
    season: {
        type: DataTypes.INTEGER
    },
    showNotes: {
        type: DataTypes.TEXT
    },
    transcript: {
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
    publishDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    uploadedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    tags: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: 'Hindi'
    },
    shares: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bookmarks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    subscribers: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    completionRate: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    averageListenDuration: {
        type: DataTypes.INTEGER, // duration in seconds
        defaultValue: 0
    },
    bookmarkedBy: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    timestamps: true
});

Podcast.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

module.exports = Podcast;
