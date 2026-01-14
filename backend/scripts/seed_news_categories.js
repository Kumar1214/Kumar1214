const { sequelize } = require('../src/shared/config/database');
const NewsCategory = require('../src/modules/content/NewsCategory');

async function seedCategories() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connected.');

        const categories = [
            { name: 'General', description: 'General news and updates', icon: 'newspaper' },
            { name: 'Events', description: 'Upcoming events and gatherings', icon: 'calendar' },
            { name: 'Announcements', description: 'Important official announcements', icon: 'bullhorn' },
            { name: 'Health', description: 'Health and wellness related news', icon: 'heart' }
        ];

        console.log('Seeding categories...');
        for (const cat of categories) {
            const [category, created] = await NewsCategory.findOrCreate({
                where: { name: cat.name },
                defaults: cat
            });

            if (created) {
                console.log(`✅ Created category: ${cat.name}`);
            } else {
                console.log(`ℹ️ Category already exists: ${cat.name}`);
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedCategories();
