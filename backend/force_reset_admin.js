const { sequelize } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');
const bcrypt = require('bcryptjs');

const resetAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const hashedPassword = await bcrypt.hash('password123', 10);

        const [updated] = await User.update({ password: hashedPassword }, {
            where: { email: 'admin@gaugyan.com' }
        });

        if (updated) {
            console.log('✅ Admin password updated to: password123');
        } else {
            console.log('⚠️ Admin user not found. Creating one...');
            await User.create({
                name: 'Admin User',
                email: 'admin@gaugyan.com',
                password: hashedPassword,
                role: 'admin',
                mobile: '9876543210'
            });
            console.log('✅ Admin user created.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error resetting admin:', error);
        process.exit(1);
    }
};

resetAdmin();
