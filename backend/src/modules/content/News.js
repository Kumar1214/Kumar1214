const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const News = sequelize.define('News', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    excerpt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    featuredImage: {
        type: DataTypes.STRING,
        defaultValue: 'default-news-image.jpg'
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    authorId: {
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
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived', 'pending'),
        defaultValue: 'pending'
    },
    lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    shares: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bookmarks: {
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
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    metaDescription: DataTypes.TEXT,
    metaKeywords: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    timestamps: true
});

News.belongsTo(User, { foreignKey: 'authorId', as: 'authorUser' });

module.exports = News;
