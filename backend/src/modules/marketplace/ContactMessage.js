const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const ContactMessage = sequelize.define('ContactMessage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('new', 'read', 'replied'),
        defaultValue: 'new'
    },
    // AI Fields
    aiTags: {
        type: DataTypes.JSON, // Array of strings e.g. ["urgent", "refund"]
        defaultValue: []
    },
    aiPriority: {
        type: DataTypes.ENUM('high', 'medium', 'low'),
        defaultValue: 'medium'
    },
    aiSentiment: {
        type: DataTypes.ENUM('positive', 'neutral', 'negative'),
        defaultValue: 'neutral'
    }
}, {
    timestamps: true
});

module.exports = ContactMessage;
