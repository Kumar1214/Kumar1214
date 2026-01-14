const { sequelize } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        console.log('connected');
        const users = await User.findAll({ attributes: ['id', 'email', 'role', 'name'] });
        console.log(JSON.stringify(users, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

checkUsers();
