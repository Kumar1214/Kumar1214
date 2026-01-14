const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine dialect and storage
const isSqlite = process.env.DB_DIALECT === 'sqlite';

console.log(`[DB] Using Dialect: ${isSqlite ? 'sqlite' : 'mysql'}`);

const sequelize = isSqlite
    ? new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: console.log
    })
    : new Sequelize(
        process.env.DB_NAME || 'gaugyanc_gaugyanworld',
        process.env.DB_USER || 'gaugyanc_gaugyanworld',
        process.env.DB_PASS || 'Password@2025_GG_SK',
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'mysql',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
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
        console.log(`[DB] ✅ ${isSqlite ? 'SQLite' : 'MySQL'} Connected Successfully`);

        // Load all models before syncing
        require('./models')();

        // Sync models with database
        // WARNING: alter:true caused crash on live DB due to "Too many keys specified"
        await sequelize.sync({ alter: false });
        console.log('[DB] ✅ Models Synced');
    } catch (error) {
        console.error('[DB] ❌ Connection Error Full:', error);
        console.error('[DB] ❌ Connection Error Stack:', error.stack);
        throw error;
    }
};

module.exports = { sequelize, connectDB };
