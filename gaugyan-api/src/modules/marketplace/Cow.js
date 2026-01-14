const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');
const User = require('../identity/User');

const Cow = sequelize.define('Cow', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    breed: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    color: DataTypes.STRING,
    image: DataTypes.STRING,
    images: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    description: DataTypes.TEXT,
    healthStatus: DataTypes.STRING,
    healthRecords: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    currentLocation: DataTypes.STRING,
    adoptionStatus: DataTypes.STRING,
    adoptedBy: DataTypes.INTEGER, // User ID
    adoptionDate: DataTypes.DATE,
    monthlyCost: DataTypes.DECIMAL(10, 2),
    specialNeeds: DataTypes.STRING,
    story: DataTypes.TEXT,
    ownerId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    gaushalaProfileId: DataTypes.INTEGER, // Can link to profile
    milkProduction: DataTypes.STRING,
    temperament: DataTypes.STRING,
    vaccinated: DataTypes.BOOLEAN,
    lastVaccinationDate: DataTypes.DATE,
    featured: DataTypes.BOOLEAN,
    views: DataTypes.INTEGER
}, {
    timestamps: true
});

Cow.belongsTo(User, { foreignKey: 'ownerId', as: 'gaushalaOwner' });

module.exports = Cow;

// Associations defined after export to handle circular dependency
const GaushalaProfile = require('./GaushalaProfile');
Cow.belongsTo(GaushalaProfile, { foreignKey: 'gaushalaProfileId', as: 'gaushalaProfile' });
