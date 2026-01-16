const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const Payout = sequelize.define('Payout', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    vendorId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'vendor_id'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING_APPROVAL', 'APPROVED_SECURITY', 'APPROVED_FINANCE', 'READY_FOR_PAYOUT', 'PROCESSING', 'COMPLETED', 'REJECTED'),
        defaultValue: 'PENDING_APPROVAL'
    },
    approvals: {
        type: DataTypes.JSON,
        defaultValue: { security: false, finance: false, admin: false }
    },
    auditLog: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    timestamps: true,
    tableName: 'payouts'
});

module.exports = Payout;
