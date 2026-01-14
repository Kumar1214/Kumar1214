require('dotenv').config();
const { sequelize } = require('./src/shared/config/database');
const fs = require('fs');

async function updateSchema() {
    try {
        console.log("Updating Database Schema...");
        // Load models
        require('./src/shared/config/models')();

        // Sync with alter: true to add missing columns
        await sequelize.sync({ alter: true });
        console.log("Schema Updated Successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Schema Update Failed:", error);
        process.exit(1);
    }
}

updateSchema();
