require('dotenv').config();
const { sequelize } = require('./src/shared/config/database');

async function checkSchema() {
    try {
        const [results] = await sequelize.query("PRAGMA table_info(Users);");
        console.log("Columns in Users table:", results.map(c => c.name));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
checkSchema();
