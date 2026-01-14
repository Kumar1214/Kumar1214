const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('./src/modules/identity/User');
const Course = require('./src/modules/learning/Course');
const Music = require('./src/modules/entertainment/Music');
const Podcast = require('./src/modules/entertainment/Podcast');
const Meditation = require('./src/modules/entertainment/Meditation');
const News = require('./src/modules/content/News');
const Knowledgebase = require('./src/modules/content/Knowledgebase');
const Product = require('./src/modules/marketplace/Product');
const Gaushala = require('./src/modules/marketplace/Gaushala');
const GaushalaProfile = require('./src/modules/marketplace/GaushalaProfile');
const Exam = require('./src/modules/learning/Exam');
const Quiz = require('./src/modules/learning/Quiz');

// Data Files - removed unused imports

dotenv.config();

// Image Helper - removed unused function

// HARDCODED CONNECTION STRING TO BYPASS ENVIRONMENT VARIABLES
const MONGO_URI = "mongodb+srv://gaugyan2024_db_user:Password%402025_GG@cluster0.svsqtrd.mongodb.net/gaugyan?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true";

const importData = async () => {
    try {
        console.log('--- FORCED SEEDER STARTING ---');
        console.log('Connecting to MongoDB directly...');

        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 75000,
        });

        console.log('MongoDB Connected Successfully!');
        console.log('Clearing existing data...');

        await mongoose.connection.db.dropDatabase();

        console.log('Creating users...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            { name: 'Admin User', email: 'admin@gaugyan.com', password: hashedPassword, role: 'admin' },
            { name: 'Dr. Rajesh Sharma', email: 'rajesh@gaugyan.com', password: hashedPassword, role: 'instructor' },
            { name: 'Pandit Hariprasad', email: 'pandit@gaugyan.com', password: hashedPassword, role: 'artist' },
            { name: 'Organic Farms India', email: 'vendor1@gaugyan.com', password: hashedPassword, role: 'vendor' },
            { name: 'Gaushala Owner', email: 'gaushala@gaugyan.com', password: hashedPassword, role: 'gaushala_owner' },
            { name: 'Regular User', email: 'user@gaugyan.com', password: hashedPassword, role: 'user' }
        ]);

        // Only keep the user IDs that are actually used
        const instructorUser = users[1]._id;
        const vendorUser = users[3]._id;

        console.log('Creating courses...');
        const coursesToInsert = [
            {
                title: 'Introduction to Ayurveda',
                description: 'Learn the fundamentals of Ayurvedic medicine and lifestyle',
                instructor: instructorUser,
                category: 'Ayurveda',
                level: 'Beginner',
                price: 999,
                originalPrice: 1499,
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
                isPublished: true,
                rating: 4.5,
                students: 150
            },
            {
                title: 'Advanced Yoga Philosophy',
                description: 'Deep dive into the philosophical aspects of Yoga',
                instructor: instructorUser,
                category: 'Yoga',
                level: 'Advanced',
                price: 1499,
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
                isPublished: true,
                rating: 4.8,
                students: 89
            }
        ];

        // Simplified dummy courses for brevity in this fix script
        const dummyCourses = Array.from({ length: 5 }).map((_, i) => ({
            title: `Dummy Course ${i + 1}`,
            description: `This is a dummy course for testing purposes ${i + 1}.`,
            instructor: instructorUser,
            category: 'Yoga',
            level: 'Beginner',
            price: 999,
            originalPrice: 1499,
            image: `https://placehold.co/600x400/2a3b55/ffffff?text=Course+${i}`,
            isPublished: true,
            rating: 4.5,
            students: 150,
            featured: i % 2 === 0
        }));
        await Course.insertMany([...coursesToInsert, ...dummyCourses]);

        console.log('Creating products...');

        // Simplified product creation
        const productsToInsert = [
            {
                name: 'Pure Desi Ghee',
                description: 'Authentic A2 Gir Cow Ghee, made using traditional Bilona method.',
                price: 1499,
                originalPrice: 1899,
                category: 'Organic Food',
                stock: 50,
                rating: 4.9,
                images: ['https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&q=80&w=400'],
                vendor: vendorUser,
                status: 'active'
            }
        ];
        await Product.insertMany(productsToInsert);

        console.log('✅ DATA IMPORT COMPLETED SUCCESSFULLY!');
        console.log('You can now log in normally.');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

importData();
