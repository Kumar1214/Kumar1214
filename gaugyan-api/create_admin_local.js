
const { sequelize } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        // Ensure table exists
        await sequelize.sync();

        const hashedPassword = await bcrypt.hash('password123', 10);

        await User.findOrCreate({
            where: { email: 'admin@gaugyan.com' },
            defaults: {
                name: 'Admin User',
                email: 'admin@gaugyan.com',
                password: hashedPassword,
                role: 'admin',
                mobile: '9876543210'
            }
        });

        console.log('✅ Admin user created: admin@gaugyan.com / password123');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
