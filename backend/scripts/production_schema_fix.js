require('dotenv').config();
const { sequelize } = require('../src/shared/config/database');
const { QueryTypes } = require('sequelize');

async function fixSchema() {
    try {
        console.log('--- Starting Extended Schema Fix ---');
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Add missing columns to Users table
        const columns = [
            // Previous fixes
            { name: 'gstNumber', type: 'VARCHAR(255)' },
            { name: 'panNumber', type: 'VARCHAR(255)' },
            { name: 'shopName', type: 'VARCHAR(255)' },
            { name: 'shopAddress', type: 'TEXT' },
            { name: 'isVerified', type: 'TINYINT(1) DEFAULT 0' },

            // NEW Fixes for JSON/Balance fields
            { name: 'billingAddress', type: 'JSON' },
            { name: 'enrolledCourses', type: 'JSON' },
            { name: 'wishlist', type: 'JSON' },
            { name: 'joinedCommunities', type: 'JSON' },
            { name: 'walletBalance', type: 'DECIMAL(10, 2) DEFAULT 0' },
            { name: 'coinBalance', type: 'INTEGER DEFAULT 0' }
        ];

        for (const col of columns) {
            try {
                // MySQL JSON column support check could be added, but assuming modern MySQL/MariaDB
                await sequelize.query(
                    `ALTER TABLE Users ADD COLUMN ${col.name} ${col.type};`,
                    { type: QueryTypes.RAW }
                );
                console.log(`✅ Added column: ${col.name}`);
            } catch (error) {
                // Check for various "duplicate column" error codes/messages
                if (
                    (error.original && error.original.code === 'ER_DUP_FIELDNAME') ||
                    error.message.includes('Duplicate column name')
                ) {
                    console.log(`ℹ️ Column ${col.name} already exists. Skipping.`);
                } else {
                    console.error(`❌ Failed to add ${col.name}: ${error.message}`);
                }
            }
        }

        console.log('--- Schema Fix Complete ---');
        process.exit(0);

    } catch (error) {
        console.error('FATAL ERROR:', error);
        process.exit(1);
    }
}

fixSchema();
