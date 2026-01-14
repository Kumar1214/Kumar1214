const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    astrologerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Astrologers',
            key: 'id'
        }
    },
    slotTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    durationMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 30
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'rescheduled'),
        defaultValue: 'scheduled'
    },
    meetingLink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'refunded'),
        defaultValue: 'pending'
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Appointment;
