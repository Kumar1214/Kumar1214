
const { sequelize } = require('./src/shared/config/database');
const Banner = require('./src/modules/content/Banner');

const ensureBanners = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        // Check for existing home banners
        const count = await Banner.count({
            where: {
                placement: 'home',
                isActive: true
            }
        });

        if (count === 0) {
            console.log('No active home banners found. Creating default banner...');
            await Banner.create({
                title: 'Welcome to GauGyan',
                description: 'Ancient Wisdom for Modern Living. Discover our courses, products, and community.',
                imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop', // Stock image of books/meditation
                linkUrl: '/courses',
                buttonText: 'Start Learning',
                placement: 'home',
                order: 1,
                isActive: true,
                backgroundColor: '#1E3A8A',
                textColor: '#FFFFFF'
            });
            console.log('✅ Default Home Banner Created');
        } else {
            console.log(`✅ Found ${count} active home banners. No action needed.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error ensuring banners:', error);
        process.exit(1);
    }
};

ensureBanners();
