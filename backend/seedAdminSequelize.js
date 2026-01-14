
const { connectDB } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');

const seedAdmin = async () => {
    try {
        await connectDB();
        console.log('Connected to DB...');

        const email = 'admin@gaugyan.com';
        const password = 'Password@2025'; // Strong password for validation

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('Admin user already exists.');
            // Update password just in case
            existingUser.password = password;
            existingUser.role = 'admin';
            await existingUser.save();
            console.log('Admin user updated with new password (Password@2025).');
        } else {
            await User.create({
                name: 'Admin User',
                email,
                password, // Hooks will hash this
                role: 'admin',
                mobile: '1234567890',
                status: 'active',
                isVerified: true
            });
            console.log(`Admin user created: ${email} / ${password}`);
        }
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedAdmin();
