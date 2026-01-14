const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Banner = sequelize.define('Banner', {
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
        type: DataTypes.TEXT
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    linkUrl: DataTypes.STRING,
    buttonText: DataTypes.STRING,
    placement: {
        type: DataTypes.ENUM('courses', 'exams', 'quiz', 'knowledgebase', 'music', 'podcast', 'meditation', 'home', 'shop', 'home-top', 'sidebar', 'footer', 'checkout', 'course-detail'),
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    backgroundColor: {
        type: DataTypes.STRING,
        defaultValue: '#1E3A8A'
    },
    textColor: {
        type: DataTypes.STRING,
        defaultValue: '#FFFFFF'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['placement', 'isActive', 'order']
        }
    ]
});

// Association
Banner.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = Banner;
