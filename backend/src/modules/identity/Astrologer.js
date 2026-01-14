const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const Astrologer = sequelize.define('Astrologer', {
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
        },
        unique: true
    },
    specialization: {
        type: DataTypes.JSON, // Array of strings: ['Vedic', 'Tarot', 'Numerology']
        defaultValue: []
    },
    experience: {
        type: DataTypes.INTEGER, // Years of experience
        defaultValue: 0
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    languages: {
        type: DataTypes.JSON, // ['Hindi', 'English']
        defaultValue: []
    },
    consultationFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2), // e.g. 4.50
        defaultValue: 0.00
    },
    consultationCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

// Association handled in index.js usually, but we can define here if independent
// User.hasOne(Astrologer);
// Astrologer.belongsTo(User);

module.exports = Astrologer;
