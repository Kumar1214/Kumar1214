const { sequelize } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');


const seedUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync(); // Ensure table exists

        const adminEmail = 'admin@gaugyan.com';
        let admin = await User.findOne({ where: { email: adminEmail } });
        const plainPassword = 'Password@123';

        if (admin) {
            console.log('Admin found, updating password...');
            admin.password = plainPassword;
            // admin.role = 'admin'; // Role is likely correct, let's just create if missing
            await admin.save(); // Model hook will hash this
            console.log('Admin password updated to: password123');
        } else {
            console.log('Admin not found, creating...');
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: plainPassword, // Model hook will hash this
                role: 'admin',
                isVerified: true,
                status: 'active'
            });
            console.log('Admin created: admin@gaugyan.com / password123');
        }
        process.exit(0);
    } catch (error) {
        console.error('Seeding/Update failed:', error);
        process.exit(1);
    }
};

seedUsers();
