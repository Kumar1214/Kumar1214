const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Knowledgebase = sequelize.define('Knowledgebase', {
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
        type: DataTypes.STRING, // Use String to allow flexibility
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    content: DataTypes.TEXT,
    videoUrl: DataTypes.STRING,
    videoName: DataTypes.STRING,
    image: {
        type: DataTypes.STRING,
        defaultValue: 'default-kb-image.jpg'
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
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'draft', 'pending'),
        defaultValue: 'pending'
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    helpful: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    notHelpful: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    relatedArticleIds: {
        type: DataTypes.JSON, // Array of IDs
        defaultValue: []
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
    }
}, {
    timestamps: true
});

Knowledgebase.belongsTo(User, { foreignKey: 'authorId', as: 'authorUser' });

module.exports = Knowledgebase;
