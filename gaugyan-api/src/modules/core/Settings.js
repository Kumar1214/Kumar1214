const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Settings = sequelize.define('Settings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
        // Removed ENUM constraint to allow flexibility or keep distinct check
    },
    settings: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '{}',
        get() {
            const rawValue = this.getDataValue('settings');
            if (typeof rawValue === 'string') {
                try {
                    return JSON.parse(rawValue);
                } catch {
                    return {};
                }
            }
            if (typeof rawValue === 'object' && rawValue !== null) {
                return rawValue;
            }
            return {};
        },
        set(value) {
            this.setDataValue('settings', JSON.stringify(value));
        }
    },
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

module.exports = Settings;
