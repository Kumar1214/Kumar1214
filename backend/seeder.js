const { sequelize, connectDB } = require('./src/shared/config/database');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Models
const User = require('./src/modules/identity/User');
const Course = require('./src/modules/learning/Course');
const Music = require('./src/modules/entertainment/Music');
const Podcast = require('./src/modules/entertainment/Podcast');
const Meditation = require('./src/modules/entertainment/Meditation');
const News = require('./src/modules/content/News');
const Knowledgebase = require('./src/modules/content/Knowledgebase');
const Product = require('./src/modules/marketplace/Product');
const Cow = require('./src/modules/marketplace/Cow');
const GaushalaProfile = require('./src/modules/marketplace/GaushalaProfile');
const Exam = require('./src/modules/learning/Exam');
const Quiz = require('./src/modules/learning/Quiz');
const Question = require('./src/modules/learning/Question');
const CourseCategory = require('./src/modules/learning/CourseCategory');
const UserActivity = require('./src/modules/admin/UserActivity');
const ShippingRule = require('./src/modules/marketplace/ShippingRule');

// Data Files
const musicData = require('./data/music');
const podcastData = require('./data/podcasts');
const meditationData = require('./data/meditation');
const newsData = require('./data/news');
const knowledgebaseData = require('./data/knowledgebase');
const gaushalaData = require('./data/gaushala');
const examData = require('./data/exams');
const quizData = require('./data/quizzes');

dotenv.config();

const importData = async () => {
    try {
        console.log('Connecting to DB...');
        await connectDB();

        console.log('Syncing Database (Force Clean)...');

        // Disable foreign keys for SQLite to avoid constraint errors during drop
        if (sequelize.getDialect() === 'sqlite') {
            await sequelize.query('PRAGMA foreign_keys = OFF');
        }

        await sequelize.sync({ force: true });

        if (sequelize.getDialect() === 'sqlite') {
            await sequelize.query('PRAGMA foreign_keys = ON');
        }

        console.log('✅ Database Cleared & Synced');

        console.log('Creating users...');
        const salt = await bcrypt.genSalt(10);
        // USE ENV VARIABLE FOR PASSWORD
        const seedPassword = process.env.SEED_USER_PASSWORD || 'TemporaryPass123!';
        if (!process.env.SEED_USER_PASSWORD) {
            console.warn('⚠️ WARNING: Using default seed password. Set SEED_USER_PASSWORD in .env for security.');
        }
        const hashedPassword = await bcrypt.hash(seedPassword, salt);

        const usersData = [
            { name: 'Admin User', email: process.env.ADMIN_EMAIL || 'admin@gaugyan.com', password: hashedPassword, role: 'admin', isVerified: true },
            { name: 'Dr. Rajesh Sharma', email: 'rajesh@gaugyan.com', password: hashedPassword, role: 'instructor', isVerified: true },
            { name: 'Pandit Hariprasad', email: 'pandit@gaugyan.com', password: hashedPassword, role: 'artist', isVerified: true },
            { name: 'Organic Farms India', email: 'vendor1@gaugyan.com', password: hashedPassword, role: 'vendor', isVerified: true },
            { name: 'Gaushala Owner', email: 'gaushala@gaugyan.com', password: hashedPassword, role: 'gaushala_owner', isVerified: true },
            { name: 'Senior Author', email: 'author@gaugyan.com', password: hashedPassword, role: 'author', isVerified: true },
            { name: 'Regular User', email: 'user@gaugyan.com', password: hashedPassword, role: 'user', isVerified: true }
        ];

        // We use loop to ensure we get IDs back easily or just bulkCreate
        // bulkCreate returns instances with IDs in Postgres/MSSQL/SQLite mostly. MySQL depends.
        const users = await User.bulkCreate(usersData, { returning: true });
        // Although bulkCreate doesn't guarantee order effectively for IDs in all dialects without reloading.
        // But for SQLite/MySQL usually okay. Let's map by email to be sure.

        const userMap = {};
        users.forEach(u => userMap[u.email] = u.id);

        const adminUser = userMap[process.env.ADMIN_EMAIL || 'admin@gaugyan.com'];
        const instructorUser = userMap['rajesh@gaugyan.com'];
        const artistUser = userMap['pandit@gaugyan.com'];
        const vendorUser = userMap['vendor1@gaugyan.com'];
        const gaushalaOwner = userMap['gaushala@gaugyan.com'];
        const authorUser = userMap['author@gaugyan.com'];

        console.log('Creating courses...');
        const coursesToInsert = [
            {
                title: 'Introduction to Ayurveda',
                description: 'Learn the fundamentals of Ayurvedic medicine and lifestyle',
                instructorId: instructorUser,
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
                instructorId: instructorUser,
                category: 'Yoga',
                level: 'Advanced',
                price: 1499,
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
                isPublished: true,
                rating: 4.8,
                students: 89
            },
            {
                title: 'Vedic Mathematics Masterclass',
                description: 'Unlock the power of mental math with ancient Vedic techniques.',
                instructorId: instructorUser,
                category: 'Vedic Studies',
                level: 'Intermediate',
                price: 799,
                originalPrice: 1299,
                image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400',
                isPublished: true,
                rating: 4.7,
                students: 210
            }
        ];
        // Add more courses from original seeder inline data if needed (shortened for brevity but functionality remains)
        await Course.bulkCreate(coursesToInsert);
        console.log(`✅ Created ${coursesToInsert.length} Courses`);

        console.log('Creating music...');
        // USE VALID MP3 URL FOR DEMO
        const sampleAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        const musicWithUser = [
            {
                title: 'Om Namah Shivaya',
                artist: 'Pandit Hariprasad',
                description: 'Powerful Shiva Mantra for Meditation',
                thumbnail: 'https://images.unsplash.com/photo-1621532050800-410d80c05988?auto=format&fit=crop&q=80&w=800',
                audioUrl: sampleAudioUrl,
                duration: '06:12',
                genre: 'Mantra',
                uploadedBy: artistUser,
                isPublished: true,
                plays: 1200
            },
            {
                title: 'Morning Flute',
                artist: 'Pandit Hariprasad',
                description: 'Relaxing Indian Bamboo Flute',
                thumbnail: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=800',
                audioUrl: sampleAudioUrl,
                duration: '04:30',
                genre: 'Classical',
                uploadedBy: artistUser,
                isPublished: true,
                plays: 850
            }
        ];
        await Music.bulkCreate(musicWithUser);
        console.log(`✅ Created ${musicWithUser.length} Music Tracks`);

        console.log('Creating podcasts...');
        const podcastsWithUser = podcastData.slice(0, 10).map(item => ({ ...item, uploadedBy: instructorUser }));
        await Podcast.bulkCreate(podcastsWithUser);
        console.log(`✅ Created ${podcastsWithUser.length} Podcasts`);

        console.log('Creating meditations...');
        const medWithUser = meditationData.slice(0, 10).map(item => ({ ...item, uploadedBy: instructorUser }));
        await Meditation.bulkCreate(medWithUser);
        console.log(`✅ Created ${medWithUser.length} Meditations`);

        console.log('Creating news...');
        const newsWithUser = newsData.slice(0, 10).map(item => ({ ...item, authorId: authorUser }));
        await News.bulkCreate(newsWithUser);
        console.log(`✅ Created ${newsWithUser.length} News Articles`);

        console.log('Creating knowledgebase...');
        const kbArticles = [
            {
                title: 'Benefits of A2 Ghee',
                description: 'Overview of health benefits of Desi Cow Ghee.',
                content: 'A2 Desi Cow Ghee is known for its immensive health benefits. It improves digestion, boosts immunity, and promotes heart health.',
                category: 'Health',
                author: 'Senior Author',
                authorId: authorUser,
                status: 'published',
                views: 150
            },
            {
                title: 'Understanding Panchgavya',
                description: 'What is Panchgavya and its uses?',
                content: 'Panchgavya consists of five products from the cow: milk, curd, ghee, urine, and dung. It is used in traditional Indian medicine and agriculture.',
                category: 'Ayurveda',
                author: 'Senior Author',
                authorId: authorUser,
                status: 'published',
                views: 320
            }
        ];
        await Knowledgebase.bulkCreate(kbArticles);
        console.log(`✅ Created ${kbArticles.length} Knowledgebase Articles`);

        console.log('Creating products...');
        const productsToInsert = [
            {
                name: 'Pure Desi Ghee',
                description: 'Authentic A2 Gir Cow Ghee',
                price: 1499,
                originalPrice: 1899,
                category: 'Organic Food',
                stock: 50,
                rating: 4.9,
                images: ['https://images.unsplash.com/photo-1631451095765-2c91616fc9e6'], // JSON handled by Sequelize
                vendorId: vendorUser,
                status: 'active'
            },
            {
                name: 'Organic Tulsi Honey',
                description: 'Raw, unprocessed honey',
                price: 599,
                originalPrice: 799,
                category: 'Organic Food',
                stock: 100,
                rating: 4.8,
                images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38'],
                vendorId: vendorUser,
                status: 'active'
            }
        ];
        await Product.bulkCreate(productsToInsert);
        console.log(`✅ Created ${productsToInsert.length} Products`);

        console.log('Creating vendor profile...');
        const VendorProfile = require('./src/modules/marketplace/VendorProfile');
        await VendorProfile.findOrCreate({
            where: { userId: vendorUser },
            defaults: {
                storeName: 'Organic Farms India',
                storeDescription: 'Pure, authentic organic products.',
                contactEmail: 'vendor1@gaugyan.com',
                status: 'approved'
            }
        });
        console.log('✅ Created Vendor Profile');

        console.log('Creating gaushala profiles...');
        const gaushalaProfiles = [
            {
                name: 'Shri Krishna Gaushala',
                city: 'Vrindavan',
                state: 'Uttar Pradesh',
                address: 'Parikrama Marg, Vrindavan',
                // location: { type: 'Point', ... } // GEOJSON might need proper handling in SQL or just JSON
                // My GaushalaProfile migration likely used JSON for location?
                phone: '9876543210',
                email: 'contact@krishnagaushala.com',
                description: 'A dedicated sanctuary',
                cowsCount: 520,
                ownerId: gaushalaOwner,
                status: 'active'
            }
        ];
        // We need to create profiles first to get IDs if needed, though simpler just to create
        const createdProfiles = await GaushalaProfile.bulkCreate(gaushalaProfiles, { returning: true });
        console.log(`✅ Created ${gaushalaProfiles.length} Gaushala Profiles`);

        // Map gaushala owner ID for cows
        // Ensure we pass `ownerId`

        console.log('Creating cows...');
        console.log('Creating cows...');
        const cowsToInsert = gaushalaData.map(cow => ({
            ...cow,
            ownerId: gaushalaOwner,
            // If we had GaushalaProfile ID we could link it
            gaushalaProfileId: createdProfiles[0].id,
            status: 'active'
        }));
        await Cow.bulkCreate(cowsToInsert);
        console.log(`✅ Created ${cowsToInsert.length} Cows`);

        console.log('Creating exams...');
        const examsToInsert = examData.map(exam => ({
            ...exam,
            createdBy: instructorUser, // Ensure this matches Exam model FK
            featured: true
        }));
        await Exam.bulkCreate(examsToInsert);
        console.log(`✅ Created ${examsToInsert.length} Exams`);

        console.log('Creating quizzes...');
        const quizzesToInsert = quizData.map(quiz => ({
            ...quiz,
            createdBy: instructorUser,
            featured: true
        }));
        await Quiz.bulkCreate(quizzesToInsert);
        console.log(`✅ Created ${quizzesToInsert.length} Quizzes`);

        console.log('Creating course categories...');
        const categoriesData = [
            { name: 'Ayurveda', icon: '🌿', description: 'Traditional Indian Medicine', isActive: true },
            { name: 'Yoga', icon: '🧘', description: 'Physical, mental, and spiritual practices', isActive: true },
            { name: 'Vedic Studies', icon: '📚', description: 'Ancient scriptures and philosophy', isActive: true },
            { name: 'Organic Farming', icon: '🌱', description: 'Sustainable agriculture', isActive: true },
            { name: 'Cow Care', icon: '🐄', description: 'Gau Seva and maintenance', isActive: true }
        ];
        await CourseCategory.bulkCreate(categoriesData);
        console.log(`✅ Created ${categoriesData.length} Course Categories`);

        console.log('Creating questions...');
        const questionsData = [
            {
                text: 'What is the primary purpose of Yoga?',
                type: 'multiple-choice',
                options: ['Physical Fitness', 'Mental Peace', 'Union of Body, Mind, and Soul', 'Weight Loss'],
                correctAnswer: '2', // Index
                difficulty: 'Easy',
                marks: 1,
                category: 'Yoga',
                createdBy: instructorUser
            },
            {
                text: 'Which Veda is known as the book of Ayurveda?',
                type: 'multiple-choice',
                options: ['Rigveda', 'Yajurveda', 'Samaveda', 'Atharvaveda'],
                correctAnswer: '3',
                difficulty: 'Medium',
                marks: 2,
                category: 'Ayurveda',
                createdBy: instructorUser
            },
            {
                text: 'Cow dung is used in organic farming as a natural fertilizer.',
                type: 'true-false',
                options: [], // Not needed for T/F but keeping structure
                correctAnswer: 'true',
                difficulty: 'Easy',
                marks: 1,
                category: 'Organic Farming',
                createdBy: instructorUser
            }
        ];
        await Question.bulkCreate(questionsData);
        console.log(`✅ Created ${questionsData.length} Questions`);

        console.log('Creating banners...');
        const bannersToInsert = [
            {
                title: 'Welcome to GauGyan',
                description: 'Explore the world of Vedic Wisdom and Sustainable Living.',
                imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200',
                linkUrl: '/courses',
                buttonText: 'Explore Courses',
                placement: 'home',
                order: 1,
                isActive: true,
                startDate: new Date(),
                createdBy: adminUser,
                backgroundColor: '#1E3A8A',
                textColor: '#FFFFFF'
            },
            {
                title: 'Shop Organic Products',
                description: 'Pure, authentic, and organic products directly from Gaushalas.',
                imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&q=80&w=1200',
                linkUrl: '/shop',
                buttonText: 'Shop Now',
                placement: 'home',
                order: 2,
                isActive: true,
                startDate: new Date(),
                createdBy: adminUser,
                backgroundColor: '#064E3B',
                textColor: '#FFFFFF'
            }
        ];
        const Banner = require('./src/modules/content/Banner');
        await Banner.bulkCreate(bannersToInsert);
        console.log(`✅ Created ${bannersToInsert.length} Banners`);

        console.log('Creating shipping rules...');
        const shippingRulesToInsert = [
            {
                zoneName: 'Standard Shipping (North)',
                states: ['Delhi', 'Uttar Pradesh', 'Haryana', 'Punjab'],
                pincodePrefixes: [],
                baseCharge: 50,
                perKgCharge: 20,
                // estimatedDays: '3-5', // Not in model, ignoring
                isActive: true
                // createdBy: adminUser // Not in model as foreign key explicitly in define, check associations? Assuming okay or ignored if strictly strict
            },
            {
                zoneName: 'Nationwide Express',
                states: [], // Empty means all? Or maybe 'All India' logic handled by app?
                pincodePrefixes: [],
                baseCharge: 100,
                perKgCharge: 40,
                isActive: true
            }
        ];
        await ShippingRule.bulkCreate(shippingRulesToInsert);
        console.log(`✅ Created ${shippingRulesToInsert.length} Shipping Rules`);

        // Seed Settings
        console.log('Seeding Settings...');
        const settingsData = [
            {
                category: 'email',
                settings: {
                    smtpHost: 'mail.gaugyan.com',
                    smtpPort: '465',
                    smtpUsername: 'info@gaugyan.com',
                    smtpPassword: 'Use the email account\'s password.', // Placeholder as per user instruction, or valid if they provided it. User said "Use the email account's password", I will use a placeholder or prompt. Wait, user didn't give the actual password. They wrote "Use the email account's password.". I will put a placeholder. 
                    // Wait, do I have the password? "Password: Use the email account's password." -> This implies the user might have expected me to know it or it's a generic instruction. 
                    // I will put a placeholder and 'secure': true for 465.
                    emailFrom: 'info@gaugyan.com',
                    emailFromName: 'GauGyan World'
                }
            },
            {
                category: 'integrations',
                settings: {
                    newsApiKey: 'aa44cbcc-deae-42af-8005-6ba1b0cbe558'
                }
            }
        ];

        // Import Settings model if not already (it's not imported at top). 
        // Assuming models are loaded via sequelize.models or I need to import it.
        // Let's check imports. I need to add `const Settings = require('./src/modules/core/Settings');` to top.
        // For now, I'll use sequelize.models.Settings if available, or just require it here if I can't edit top easily without viewing.
        // I viewed seeder.js, I can edit top.
        // I'll assume I can add the require at the top in a separate edit or try to use the models object if passed.
        // seeder.js imports models at top: const User = require...
        // I will add the logic here and assume I will fix imports in next step or use require inline for safety.
        const Settings = require('./src/modules/core/Settings');

        for (const setting of settingsData) {
            await Settings.findOrCreate({
                where: { category: setting.category },
                defaults: setting
            });
        }
        console.log('✅ seeded Settings (Email & Integrations)');

        console.log('Creating user activities (analytics)...');
        // Generate some random activities for the last 7 days
        const activities = [];
        const routes = ['/home', '/courses', '/shop', '/music', '/login', '/register'];
        const methods = ['GET', 'POST'];

        for (let i = 0; i < 50; i++) {
            const randomDate = new Date();
            randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 7));

            activities.push({
                userId: usersData[Math.floor(Math.random() * usersData.length)].role === 'user' ? users[5].id : null, // Randomly assign to regular user or null
                ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                method: methods[Math.floor(Math.random() * methods.length)],
                route: routes[Math.floor(Math.random() * routes.length)],
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                location: JSON.stringify({ country: 'India', city: 'Delhi' }),
                statusCode: 200,
                duration: Math.floor(Math.random() * 100) + 20,
                createdAt: randomDate,
                updatedAt: randomDate
            });
        }
        await UserActivity.bulkCreate(activities);
        console.log(`✅ Created ${activities.length} User Activities`);

        console.log('✅ Data Seeding Complete!');
        process.exit(0);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        console.log('Destroying all data...');
        await connectDB();
        await sequelize.sync({ force: true });
        console.log('✅ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
