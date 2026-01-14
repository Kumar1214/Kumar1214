require('dotenv').config();
const { sequelize } = require('./src/shared/config/database');

async function checkAdmin() {
    try {
        const [users] = await sequelize.query("SELECT id, email, role FROM Users WHERE email='admin@gaugyan.com'");
        console.log("Admin User in DB:", users);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
checkAdmin();
