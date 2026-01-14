const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const VerificationRequest = sequelize.define('VerificationRequest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('vendor', 'gaushala', 'artist', 'instructor'),
        allowNull: false
    },
    aadharNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    aadharCardUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'URL to uploaded Aadhar image/pdf'
    },
    panNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    panCardUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gstNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gstCertificateUrl: {
        type: DataTypes.STRING,
        allowNull: true // Optional for some
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    adminComments: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

VerificationRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = VerificationRequest;
