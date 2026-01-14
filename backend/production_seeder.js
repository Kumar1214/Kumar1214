const { sequelize, connectDB } = require('./src/shared/config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('./src/modules/identity/User');
const CourseCategory = require('./src/modules/learning/CourseCategory');
const Settings = require('./src/modules/core/Settings');

async function productionSeed() {
    try {
        console.log('🔌 Connecting to database...');
        await connectDB();
        console.log('✅ Database connected.');

        // 1. Seed Admin User
        console.log('👤 Checking Admin User...');
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@gaugyan.com';
        const adminExists = await User.findOne({ where: { email: adminEmail } });

        if (!adminExists) {
            console.log('Creating Admin User...');
            const salt = await bcrypt.genSalt(10);
            const password = process.env.SEED_USER_PASSWORD || 'TemporaryPass123!';
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            console.log('✅ Admin User Created.');
        } else {
            console.log('⏭️  Admin User already exists.');
        }

        // 2. Seed Course Categories
        console.log('📚 Checking Course Categories...');
        const categoriesData = [
            { name: 'Ayurveda', icon: '🌿', description: 'Traditional Indian Medicine', isActive: true },
            { name: 'Yoga', icon: '🧘', description: 'Physical, mental, and spiritual practices', isActive: true },
            { name: 'Vedic Studies', icon: '📚', description: 'Ancient scriptures and philosophy', isActive: true },
            { name: 'Organic Farming', icon: '🌱', description: 'Sustainable agriculture', isActive: true },
            { name: 'Cow Care', icon: '🐄', description: 'Gau Seva and maintenance', isActive: true }
        ];

        for (const cat of categoriesData) {
            const exists = await CourseCategory.findOne({ where: { name: cat.name } });
            if (!exists) {
                await CourseCategory.create(cat);
                console.log(`   + Created Category: ${cat.name}`);
            }
        }
        console.log('✅ Categories Verified.');

        // 3. Seed Default Settings
        console.log('⚙️  Checking Default Settings...');
        const defaultSettings = [
            {
                category: 'email',
                settings: {
                    smtpHost: 'mail.gaugyan.com',
                    smtpPort: '465',
                    smtpUsername: 'info@gaugyan.com',
                    secure: true,
                    emailFrom: 'info@gaugyan.com',
                    emailFromName: 'GauGyan World'
                }
            },
            {
                category: 'general',
                settings: {
                    siteName: 'GauGyan World',
                    siteDescription: 'Ancient Wisdom for Modern Living',
                    contactEmail: 'info@gaugyan.com'
                }
            }
        ];

        for (const setting of defaultSettings) {
            const exists = await Settings.findOne({ where: { category: setting.category } });
            if (!exists) {
                await Settings.create(setting);
                console.log(`   + Created Settings: ${setting.category}`);
            }
        }
        console.log('✅ Settings Verified.');

        console.log('🎉 Production Seeding Completed Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
}

productionSeed();
