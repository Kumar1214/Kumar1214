const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
);

async function listTables() {
    try {
        await sequelize.authenticate();
        console.log('Connection successful.');

        const [results] = await sequelize.query('SHOW TABLES');
        console.log('Tables in database:');
        results.forEach(row => {
            console.log(Object.values(row)[0]);
        });

    } catch (error) {
        console.error('Unable to connect or query:', error);
    } finally {
        await sequelize.close();
    }
}

listTables();
