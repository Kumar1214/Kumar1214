const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const MusicAlbum = sequelize.define('MusicAlbum', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    timestamps: true
});

module.exports = MusicAlbum;
