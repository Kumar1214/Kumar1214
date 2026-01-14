const { sequelize } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');

const resetAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const admin = await User.findOne({ where: { email: 'admin@gaugyan.com' } });

        if (admin) {
            // Set PLAIN TEXT password - model hook will hash it!
            admin.password = 'Password@123';
            admin.role = 'admin'; // Ensure role is correct
            await admin.save();
            console.log('✅ Admin password updated to: Password@123 (Plain text -> Hashed by hook)');
        } else {
            console.log('❌ Admin user not found. Creating new...');
            await User.create({
                name: 'Admin User',
                email: 'admin@gaugyan.com',
                password: 'Password@123', // Plain text
                role: 'admin',
                mobile: '9876543210'
            });
            console.log('✅ Admin user created');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error resetting admin:', error);
        process.exit(1);
    }
};

resetAdmin();
