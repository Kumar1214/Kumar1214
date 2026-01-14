const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const VendorProfile = sequelize.define('VendorProfile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // User association usually handled via references, but good to have explicit userId column def if strict
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    storeName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    storeDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    logo: DataTypes.STRING,
    banner: DataTypes.STRING,
    address: {
        type: DataTypes.JSON, // { street, city, state, zipCode, country }
        defaultValue: {}
    },
    contactEmail: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    contactPhone: DataTypes.STRING,
    gstNumber: DataTypes.STRING,
    bankAccount: {
        type: DataTypes.JSON // { accountName, accountNumber, bankName, ifscCode }
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'suspended'),
        defaultValue: 'pending'
    },
    commissionRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 10.00
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true
});

VendorProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = VendorProfile;
