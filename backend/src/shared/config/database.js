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
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: process.env.NODE_ENV === 'production' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {},
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
    } catch (error) {
        console.error('[DB] ❌ Connection Error Full:', error);
        console.error('[DB] ❌ Connection Error Stack:', error.stack);
        throw error;
    }
};

module.exports = { sequelize, connectDB };
