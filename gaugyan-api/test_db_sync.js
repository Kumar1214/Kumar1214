const { sequelize, connectDB } = require('./src/shared/config/database');
// const models = require('./src/shared/config/models');

const testSync = async () => {
    try {
        console.log('Connecting...');
        await connectDB();
        console.log('Models loaded:', Object.keys(sequelize.models));
        console.log('Syncing...');
        await sequelize.sync({ force: true });
        console.log('Sync validation successful!');
        process.exit(0);
    } catch (error) {
        console.error('Sync Error:', error);
        process.exit(1);
    }
};

testSync();
