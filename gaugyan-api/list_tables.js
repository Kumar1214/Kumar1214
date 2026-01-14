const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

const listTables = async () => {
    try {
        const tables = await sequelize.getQueryInterface().showAllSchemas();
        // For sqlite showAllSchemas often returns list of tables
        console.log('Tables:', tables);

        // Alternative explicit query
        const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table';");
        console.log('Tables (SQL):', results);
    } catch (error) {
        console.error(error);
    }
};

listTables();
