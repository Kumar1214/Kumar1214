const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Music = sequelize.define('Music', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false
    },
    album: {
        type: DataTypes.STRING
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
        // Removed ENUM constraint to allow flexibility matching MusicGenre model
    },
    mood: {
        type: DataTypes.STRING
    },
    audioUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coverArt: {
        type: DataTypes.STRING,
        defaultValue: 'default-music-cover.jpg'
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lyrics: {
        type: DataTypes.TEXT
    },
    description: {
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
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    uploadedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: 'Hindi'
    },
    releaseDate: {
        type: DataTypes.DATE
    },
    downloads: {
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
    playlistAdds: {
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
    }
}, {
    timestamps: true
});

Music.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

module.exports = Music;
