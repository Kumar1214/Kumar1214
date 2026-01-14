const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const StorageConfig = sequelize.define('StorageConfig', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    config: {
        type: DataTypes.JSON, // Stores provider-specific config
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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

StorageConfig.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });

module.exports = StorageConfig;
