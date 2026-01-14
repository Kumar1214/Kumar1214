const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const GaushalaProfile = sequelize.define('GaushalaProfile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    address: DataTypes.STRING,
    location: {
        type: DataTypes.JSON, // For GeoJSON or simple coords
        defaultValue: {}
    },
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    description: DataTypes.TEXT,
    established: DataTypes.STRING,
    timings: DataTypes.STRING,
    cowsCount: DataTypes.INTEGER,
    staffCount: DataTypes.INTEGER,
    image: DataTypes.STRING,
    ownerId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    }
}, {
    timestamps: true
});

module.exports = GaushalaProfile;

// Associations
// Define after export to allow circular dependencies to resolve
GaushalaProfile.hasMany(require('./Cow'), { foreignKey: 'gaushalaProfileId', as: 'cows' });
