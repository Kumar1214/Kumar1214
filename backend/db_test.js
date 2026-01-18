require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('--- DB DEBUG START ---');
console.log('ENV FILE LOADED');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_DIALECT:', process.env.DB_DIALECT);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: console.log
    }
);

sequelize.authenticate()
    .then(() => console.log('✅ CONNECTION SUCCESS'))
    .catch(err => {
        console.error('❌ CONNECTION FAILED:');
        console.error(err);
    });
