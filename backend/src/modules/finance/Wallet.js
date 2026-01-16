const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const Wallet = sequelize.define('Wallet', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    vendorId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'vendor_id'
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR'
    }
}, {
    timestamps: true,
    tableName: 'wallets'
});

module.exports = Wallet;
