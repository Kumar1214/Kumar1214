
const { sequelize, connectDB } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');
const Course = require('./src/modules/learning/Course');
const Exam = require('./src/modules/learning/Exam');
const Product = require('./src/modules/marketplace/Product');
const Banner = require('./src/modules/content/Banner');
const News = require('./src/modules/content/News');

const seedData = async () => {
    try {
        await connectDB();
        console.log('Synchronizing models...');
        // Using alter: true to update schema if needed without dropping data, 
        // but for a clean seed, we might ideally want force: true. 
        // For now, let's stick to simple creation checks or just create.
        // await sequelize.sync({ alter: true }); // Removed to avoid SQLite foreign key errors

        console.log('Seeding Users...');
        // 1. Admin
        const [admin] = await User.findOrCreate({
            where: { email: 'admin@gaugyan.com' },
            defaults: {
                name: 'Admin User',
                password: 'Password@2025',
                role: 'admin',
                mobile: '9876543210',
                status: 'active',
                isVerified: true
            }
        });

        // 2. Instructor
        const [instructor] = await User.findOrCreate({
            where: { email: 'instructor@gaugyan.com' },
            defaults: {
                name: 'Yoga Acharya',
                password: 'Password@2025',
                role: 'instructor',
                mobile: '9876543211',
                status: 'active',
                isVerified: true,
                detail: 'Expert in Hatha Yoga and Meditation.'
            }
        });

        // 3. Vendor
        const [vendor] = await User.findOrCreate({
            where: { email: 'vendor@gaugyan.com' },
            defaults: {
                name: 'Organic Vendor',
                password: 'Password@2025',
                role: 'vendor',
                mobile: '9876543212',
                status: 'active',
                isVerified: true,
                detail: 'Seller of authentic organic products.'
            }
        });

        console.log('Seeding Courses...');
        const courses = [
            {
                title: 'Introduction to Vedic Astrology',
                description: 'Learn the basics of Vedic Astrology and how to read a birth chart.',
                instructorId: instructor.id,
                category: 'Vedic Studies',
                level: 'Beginner',
                price: 499,
                isActive: true,
                isPublished: true,
                image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop',
                chapters: [{ title: 'Chapter 1: The Planets', content: 'Intro to planets...' }]
            },
            {
                title: 'Advanced Hatha Yoga',
                description: 'Deepen your yoga practice with advanced asanas and pranayama.',
                instructorId: instructor.id,
                category: 'Yoga',
                level: 'Advanced',
                price: 999,
                isActive: true,
                isPublished: true,
                image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=500&auto=format&fit=crop',
                chapters: [{ title: 'Chapter 1: Advanced Poses', content: 'Headstand guide...' }]
            },
            {
                title: 'Principles of Ayurveda',
                description: 'Understand the three doshas and how to balance them.',
                instructorId: instructor.id,
                category: 'Ayurveda',
                level: 'Intermediate',
                price: 0, // Free
                isActive: true,
                isPublished: true,
                image: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=500&auto=format&fit=crop',
                chapters: [{ title: 'Chapter 1: Doshas', content: 'Vata, Pitta, Kapha...' }]
            }
        ];

        for (const c of courses) {
            await Course.findOrCreate({
                where: { title: c.title },
                defaults: c
            });
        }

        console.log('Seeding Products...');
        const products = [
            {
                name: 'Organic Cow Ghee',
                description: 'Pure desi cow ghee made from traditional bilona method.',
                category: 'Cow Products',
                price: 1500,
                vendorId: vendor.id,
                vendorName: vendor.name,
                stock: 50,
                status: 'active',
                images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop'],
                sku: 'GHEE-001'
            },
            {
                name: 'Copper Water Bottle',
                description: 'Handcrafted copper bottle for health benefits.',
                category: 'Handicrafts',
                price: 850,
                vendorId: vendor.id,
                vendorName: vendor.name,
                stock: 20,
                status: 'active',
                images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop'],
                sku: 'COPPER-001'
            }
        ];

        for (const p of products) {
            await Product.findOrCreate({
                where: { sku: p.sku },
                defaults: p
            });
        }

        console.log('Seeding Banners...');
        const banners = [
            {
                title: 'Welcome to GauGyan',
                imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&auto=format&fit=crop',
                placement: 'home',
                isActive: true,
                createdBy: admin.id,
                order: 1
            },
            {
                title: 'Summer Sale',
                imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&auto=format&fit=crop',
                placement: 'home',
                isActive: true,
                createdBy: admin.id,
                order: 2
            }
        ];

        for (const b of banners) {
            await Banner.findOrCreate({
                where: { title: b.title },
                defaults: b
            });
        }

        console.log('Seeding Exams...');
        const exams = [
            {
                title: 'Vedic Knowledge Certification',
                description: 'A comprehensive exam to test your knowledge of Vedic literature and philosophy.',
                category: 'Vedic Studies',
                level: 'Intermediate',
                difficulty: 'Medium',
                duration: 60,
                price: 100, // ₹100
                passingMarks: 40,
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Ends in 30 days
                resultDate: new Date(new Date().setDate(new Date().getDate() + 35)),
                image: 'https://images.unsplash.com/photo-1515549832467-8783363e19b6?w=600&auto=format&fit=crop',
                createdBy: admin.id,
                questions: [
                    { id: 1, text: 'What is the oldest Veda?', marks: 2, type: 'multiple_choice', options: ['Rigveda', 'Samaveda', 'Yajurveda', 'Atharvaveda'], answer: 'Rigveda' },
                    { id: 2, text: 'Who wrote the Mahabharata?', marks: 2, type: 'multiple_choice', options: ['Valmiki', 'Vyasa', 'Tulsidas', 'Kalidasa'], answer: 'Vyasa' }
                ],
                topics: ['Vedas', 'Upanishads', 'Epics'],
                requirements: ['Basic understanding of Sanskrit terms', 'Stable internet connection'],
                prizes: [
                    { title: 'Gold Medal', icon: 'medal', description: 'For top scorer' },
                    { title: 'Certificate', icon: 'certificate', description: 'For all passing candidates' }
                ]
            }
        ];

        for (const e of exams) {
            await Exam.findOrCreate({
                where: { title: e.title },
                defaults: e
            });
        }

        console.log('Seeding News...');
        const newsCheck = await News.count();
        if (newsCheck === 0) {
            await News.create({
                title: 'The Benefits of Cow Hugging',
                excerpt: 'Discover why cow hugging is the new wellness trend.',
                content: 'Full article content here...',
                category: 'Wellness',
                author: admin.name,
                authorId: admin.id,
                status: 'published',
                featured: true,
                featuredImage: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&auto=format&fit=crop'
            });
        }

        console.log('✅ Seeding Completed Successfully!');
    } catch (error) {
        console.error('❌ Seeding Failed:', error);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

seedData();
