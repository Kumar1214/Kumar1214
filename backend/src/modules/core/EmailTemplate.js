const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const EmailTemplate = sequelize.define('EmailTemplate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique identifier for code reference e.g., welcome_email'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Display name e.g., Welcome Email'
    },
    module: {
        type: DataTypes.STRING,
        defaultValue: 'general',
        comment: 'Category: auth, ecommerce, marketing, etc.'
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'HTML content of the email'
    },
    variables: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'List of available variables for this template e.g., ["name", "orderId"]'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'email_templates',
    timestamps: true
});

module.exports = EmailTemplate;
