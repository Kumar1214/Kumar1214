const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Page = sequelize.define('Page', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    metaTitle: DataTypes.STRING,
    metaDescription: DataTypes.TEXT,
    sections: {
        type: DataTypes.JSON, // Stores array of section objects
        defaultValue: []
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    publishedAt: DataTypes.DATE,
    updatedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

Page.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });

module.exports = Page;
