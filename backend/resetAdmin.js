const mongoose = require('mongoose');
const User = require('./src/modules/identity/User');
require('dotenv').config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        const email = 'admin@mediocity.com';
        const password = 'admin123';

        let admin = await User.findOne({ email });

        if (!admin) {
            console.log('Admin user not found. Creating new one...');
            admin = new User({
                name: 'Admin Mediocity',
                email,
                role: 'admin',
                mobile: '+917777777777',
                status: 'active'
            });
        } else {
            console.log('Admin user found. Resetting password...');
        }

        admin.password = password; // Will be hashed by pre-save hook
        await admin.save();

        console.log(`Admin password reset to: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error resetting admin:', error);
        process.exit(1);
    }
};

resetAdmin();
