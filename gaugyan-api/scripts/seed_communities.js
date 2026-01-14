const { sequelize } = require('../src/shared/config/database');
const Community = require('../src/modules/content/Community');

async function seedCommunities() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync model to ensure table exists
        await Community.sync({ alter: true });

        const communities = [
            { name: 'General', icon: 'Users', description: 'General discussion for everyone.' },
            { name: 'Classical Music', icon: 'Music', description: 'Discuss ragas, talas, and performances.' },
            { name: 'Devotional', icon: 'Star', description: 'Spiritual and devotional topics.' },
            { name: 'Marketplace', icon: 'ShoppingBag', description: 'Buy, sell, and trade instruments and gear.' },
            { name: 'Tech & Support', icon: 'TrendingUp', description: 'Help with the app and technical issues.' }
        ];

        for (const c of communities) {
            await Community.findOrCreate({
                where: { name: c.name },
                defaults: {
                    ...c,
                    slug: c.name.toLowerCase().replace(/ /g, '-').replace('&', 'and')
                }
            });
        }

        console.log('Communities seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedCommunities();
