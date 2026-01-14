const { DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/database');

const Meeting = sequelize.define('Meeting', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    meetingId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ownerId: {
        type: DataTypes.STRING
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING, // Storing as string per frontend input 'DD-MM-YYYY | HH:MM:SS'
        allowNull: false
    },
    course: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'meetings'
});

module.exports = Meeting;
