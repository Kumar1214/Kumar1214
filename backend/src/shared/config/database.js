const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log(`[DB] Using Dialect: PostgreSQL`);

const sequelize = new Sequelize(
    process.env.DB_NAME || 'gaugyanc_gaugyanworld',
    process.env.DB_USER || 'gaugyanc_gaugyanw',
    process.env.DB_PASS || 'Password@2026_GG_',
    {
        host: process.env.DB_HOST || 'localhost',
        port: 5432,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 100,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: (process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1' || process.env.DB_SSL === 'false') ? {} : {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: {
            timestamps: true,
            paranoid: false
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`[DB] ✅ PostgreSQL Connected Successfully`);

        // Load all models before syncing
        require('../models')();

        // Sync models with database
        // WARNING: alter:true caused crash on live DB due to "Too many keys specified", but needed for local dev
        // WARNING: alter:true caused crash on live DB. Disabled to prevent "UNIQUE" syntax error.
        await sequelize.sync({ alter: false });
        console.log('[DB] ✅ Models Synced');

        // SELF-HEALING: Auto-fix known schema issues
        try {
            await sequelize.query('ALTER TABLE "News" ALTER COLUMN "title" TYPE TEXT;');
            await sequelize.query('ALTER TABLE "News" ALTER COLUMN "url" TYPE TEXT;');
            console.log('[DB] 🛠️ Auto-Migration: News title/url converted to TEXT');
        } catch (err) {
            // Ignore error if column doesn't exist or already converted (it's safe)
            console.warn('[DB] Auto-Migration skipped (likely already applied):', err.message);
        }
    } catch (error) {
        console.error('[DB] ❌ Connection Error Full:', error);
        console.error('[DB] ❌ Connection Error Stack:', error.stack);
        throw error;
    }
};

module.exports = { sequelize, connectDB };
