const { sequelize } = require('./src/shared/config/database');
const Quiz = require('./src/modules/learning/Quiz');

(async () => {
    try {
        console.log('Connecting...');
        await sequelize.authenticate();
        console.log('Authenticated.');

        console.log('Syncing (alter: true)...');
        await sequelize.sync({ alter: true });
        console.log('Synced.');

        const [results] = await sequelize.query("PRAGMA table_info(Quizzes);");
        console.log('Quizzes Columns:', results.map(r => r.name));

        const hasShares = results.some(r => r.name === 'shares');
        console.log('Has shares column:', hasShares);

    } catch (err) {
        console.error('Error:', err);
    }
})();
