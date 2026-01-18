const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

// Setup Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME || 'gaugyanc_gaugyanworld',
    process.env.DB_USER || 'gaugyanc_user',
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

// Define User Model (Simplified for seeding)
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'instructor', 'vendor', 'editor', 'artist', 'gaushala_owner'),
        defaultValue: 'user'
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

const demoUsers = [
    { name: 'Demo Vendor', email: 'vendor@gaugyan.com', role: 'vendor' },
    { name: 'Demo Instructor', email: 'instructor@gaugyan.com', role: 'instructor' },
    { name: 'Demo Artist', email: 'artist@gaugyan.com', role: 'artist' },
    { name: 'Demo Editor', email: 'editor@gaugyan.com', role: 'editor' },
    { name: 'Demo Owner', email: 'owner@gaugyan.com', role: 'gaushala_owner' },
    { name: 'Demo User', email: 'user@gaugyan.com', role: 'user' },
    { name: 'Secondary Admin', email: 'admin2@gaugyan.com', role: 'admin' }
];

const seedDemoUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        for (const u of demoUsers) {
            const exists = await User.findOne({ where: { email: u.email } });
            if (!exists) {
                await User.create({
                    name: u.name,
                    email: u.email,
                    password: 'Password@123', // Will be hashed by hook
                    role: u.role,
                    isVerified: true
                });
                console.log(`Created: ${u.email} (${u.role})`);
            } else {
                console.log(`Exists: ${u.email}`);
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDemoUsers();
