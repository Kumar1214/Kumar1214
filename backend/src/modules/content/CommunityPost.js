const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const CommunityPost = sequelize.define('CommunityPost', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'General'
    },
    media: {
        type: DataTypes.JSON, // Array of media objects { type, url, mediaId }
        defaultValue: []
    },
    likes: {
        type: DataTypes.JSON, // Array of user IDs
        defaultValue: []
    },
    comments: {
        type: DataTypes.JSON, // Array of comment objects { author: id, content, createdAt }
        defaultValue: []
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

CommunityPost.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = CommunityPost;
