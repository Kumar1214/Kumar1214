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

async function checkData() {
    try {
        await sequelize.authenticate();
        console.log('Connection successful.');

        const tables = ['Users', 'Courses', 'Products', 'Roles'];

        for (const table of tables) {
            try {
                const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`${table} count:`, results[0].count);
            } catch (e) {
                console.log(`Error querying ${table}:`, e.message);
            }
        }

        // Try to get a user to log in with
        try {
            const [users] = await sequelize.query(`SELECT email, password, role FROM Users LIMIT 1`);
            if (users.length > 0) {
                console.log('Sample User found:', users[0].email);
            } else {
                console.log('No users found.');
            }
        } catch (e) {
            console.log('Error fetching users:', e.message);
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

checkData();
