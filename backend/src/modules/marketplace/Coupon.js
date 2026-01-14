const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        defaultValue: 'percentage'
    },
    minPurchase: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    maxDiscount: {
        type: DataTypes.FLOAT,
        defaultValue: null
    },
    validFrom: {
        type: DataTypes.DATE,
        allowNull: false
    },
    validUntil: {
        type: DataTypes.DATE,
        allowNull: false
    },
    usageLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    usedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('active', 'expired', 'inactive'),
        defaultValue: 'active'
    },
    applicableTo: {
        type: DataTypes.STRING,
        defaultValue: 'all' // 'all', 'courses', 'products'
    },
    vendorId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Null means system-wide coupon (Admin), otherwise specific to Vendor
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

module.exports = Coupon;
