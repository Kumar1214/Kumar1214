const { sequelize } = require('./src/shared/config/database');

/**
* Database Migration Script
* Adds missing columns to existing tables to fix 500 errors
* 
* Run this on the server: node add_missing_columns.js
*/

async function addMissingColumns() {
    console.log('🔧 Starting database migration...');
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected.');
    } catch (e) {
        console.error('❌ Connection Failed:', e.message);
        process.exit(1);
    }

    const queryInterface = sequelize.getQueryInterface();

    const tablesToUpdate = {
        Products: [
            { name: 'views', type: 'INTEGER', default: 0 },
            { name: 'shares', type: 'INTEGER', default: 0 },
            { name: 'bookmarks', type: 'INTEGER', default: 0 },
            { name: 'cartAdds', type: 'INTEGER', default: 0 },
            { name: 'wishlistAdds', type: 'INTEGER', default: 0 },
            { name: 'revenue', type: 'DECIMAL(10, 2)', default: 0 },
            { name: 'bookmarkedBy', type: 'JSON', default: [] }
        ],
        Courses: [
            { name: 'views', type: 'INTEGER', default: 0 },
            { name: 'shares', type: 'INTEGER', default: 0 },
            { name: 'bookmarks', type: 'INTEGER', default: 0 },
            { name: 'completions', type: 'INTEGER', default: 0 },
            { name: 'revenue', type: 'DECIMAL(10, 2)', default: 0 },
            { name: 'bookmarkedBy', type: 'JSON', default: [] }
        ],
        News: [
            { name: 'views', type: 'INTEGER', default: 0 },
            { name: 'shares', type: 'INTEGER', default: 0 },
            { name: 'bookmarks', type: 'INTEGER', default: 0 },
            { name: 'lastUpdated', type: 'DATE', default: null },
            { name: 'bookmarkedBy', type: 'JSON', default: [] }
        ],
        Knowledgebases: [
            { name: 'views', type: 'INTEGER', default: 0 },
            { name: 'shares', type: 'INTEGER', default: 0 },
            { name: 'bookmarks', type: 'INTEGER', default: 0 },
            { name: 'lastUpdated', type: 'DATE', default: null },
            { name: 'bookmarkedBy', type: 'JSON', default: [] }
        ],
        Exams: [
            { name: 'views', type: 'INTEGER', default: 0 },
            { name: 'shares', type: 'INTEGER', default: 0 },
            { name: 'bookmarks', type: 'INTEGER', default: 0 },
            { name: 'bookmarkedBy', type: 'JSON', default: [] },
            { name: 'instructions', type: 'JSON', default: [] },
            { name: 'prizes', type: 'JSON', default: [] },
            { name: 'winners', type: 'JSON', default: [] },
            { name: 'studyMaterial', type: 'JSON', default: [] },
            { name: 'topics', type: 'JSON', default: [] },
            { name: 'requirements', type: 'JSON', default: [] },
            { name: 'attempts', type: 'JSON', default: [] }
        ],
        Quizzes: [
            { name: 'views', type: 'INTEGER', default: 0 },
            { name: 'shares', type: 'INTEGER', default: 0 },
            { name: 'bookmarks', type: 'INTEGER', default: 0 },
            { name: 'bookmarkedBy', type: 'JSON', default: [] },
            { name: 'prizes', type: 'JSON', default: [] },
            { name: 'winners', type: 'JSON', default: [] },
            { name: 'studyMaterial', type: 'JSON', default: [] },
            { name: 'attempts', type: 'JSON', default: [] }
        ],
        Questions: [
            { name: 'options', type: 'JSON', default: [] },
            { name: 'tags', type: 'JSON', default: [] }
        ],
        Music: [
            { name: 'views', type: 'INTEGER', default: 0 },
            { name: 'shares', type: 'INTEGER', default: 0 },
            { name: 'bookmarks', type: 'INTEGER', default: 0 },
            { name: 'downloads', type: 'INTEGER', default: 0 },
            { name: 'bookmarkedBy', type: 'JSON', default: [] }
        ],
        Podcasts: [
            { name: 'views', type: 'INTEGER', default: 0 },
            { name: 'shares', type: 'INTEGER', default: 0 },
            { name: 'bookmarks', type: 'INTEGER', default: 0 },
            { name: 'downloads', type: 'INTEGER', default: 0 },
            { name: 'subscribers', type: 'INTEGER', default: 0 },
            { name: 'bookmarkedBy', type: 'JSON', default: [] }
        ],
        Meditations: [
            { name: 'views', type: 'INTEGER', default: 0 },
            { name: 'shares', type: 'INTEGER', default: 0 },
            { name: 'bookmarks', type: 'INTEGER', default: 0 },
            { name: 'downloads', type: 'INTEGER', default: 0 },
            { name: 'bookmarkedBy', type: 'JSON', default: [] }
        ]
    };

    for (const [table, columns] of Object.entries(tablesToUpdate)) {
        console.log(`\n📦 Updating ${table} table...`);
        for (const col of columns) {
            try {
                const columnConfig = {
                    type: sequelize.Sequelize[col.type] || sequelize.Sequelize.DataTypes[col.type.split('(')[0]],
                    allowNull: col.default === null
                };
                if (col.default !== null) {
                    columnConfig.defaultValue = col.default;
                }

                // Special handling for DECIMAL types because sequelize.Sequelize['DECIMAL(10, 2)'] won't work
                if (col.type === 'DECIMAL(10, 2)') {
                    columnConfig.type = sequelize.Sequelize.DECIMAL(10, 2);
                }

                await queryInterface.addColumn(table, col.name, columnConfig);
                console.log(`   ✅ Added ${col.name}`);
            } catch (e) {
                if (e.message.toLowerCase().includes('duplicate column') || e.message.toLowerCase().includes('already exists')) {
                    console.log(`   ⏭️  ${col.name} already exists`);
                } else {
                    console.log(`   ❌ Error adding ${col.name}: ${e.message}`);
                }
            }
        }
    }

    console.log('\n✅ Database migration completed successfully!');
    process.exit(0);
}

addMissingColumns().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
