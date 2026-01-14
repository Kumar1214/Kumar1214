const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const ShippingRule = sequelize.define('ShippingRule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    zoneName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // For simple zone matching: List of states or pincode prefixes
    states: {
        type: DataTypes.JSON,
        defaultValue: [] // ["Delhi", "Haryana", "UP"]
    },
    pincodePrefixes: {
        type: DataTypes.JSON,
        defaultValue: [] // ["11", "12", "20"] - matches startsWith
    },
    baseCharge: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 50.00
    },
    perKgCharge: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 20.00
    },
    freeShippingThreshold: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true // If order total > this, free shipping
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = ShippingRule;
