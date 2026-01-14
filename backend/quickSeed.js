
const { sequelize } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB (No Sync)...');

        const email = 'admin@gaugyan.com';
        const password = 'Password@2025';

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('Admin user already exists.');
            existingUser.password = password;
            existingUser.role = 'admin';
            await existingUser.save();
            console.log('Admin user updated.');
        } else {
            await User.create({
                name: 'Admin User',
                email,
                password,
                role: 'admin',
                mobile: '1234567890',
                status: 'active',
                isVerified: true
            });
            console.log(`Admin user created: ${email} / ${password}`);
        }
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

seedAdmin();
