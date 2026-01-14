const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/modules/identity/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@mediocity.com' });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin Mediocity',
            email: 'admin@mediocity.com',
            password: 'admin123',
            role: 'admin',
            mobile: '+917777777',
            status: 'active'
        });

        console.log('Admin user created successfully!');
        console.log('Email: admin@mediocity.com');
        console.log('Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
