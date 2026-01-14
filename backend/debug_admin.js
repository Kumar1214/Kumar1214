
const { sequelize } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');

const debugAdmins = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to SQLite DB');

        // Find all users with admin role or all users if role not found
        // Inspecting the schema by just dumping all users first
        const users = await User.findAll();

        console.log('--- FOUND USERS ---');
        users.forEach(u => {
            console.log(`ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Name: ${u.name}, Status: ${u.status}`);
        });
        console.log('-------------------');

    } catch (error) {
        console.error('Error debugging admins:', error);
    }
};

debugAdmins();
