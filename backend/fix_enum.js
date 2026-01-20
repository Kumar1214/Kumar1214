const Sequelize = require('sequelize');
const { sequelize } = require('../../../config/database'); // Adjust path as needed

async function fixEnum() {
    try {
        console.log('🔄 Checking Knowledgebase status enum...');

        // Check constraint name - oftentimes it's enum_Knowledgebases_status
        // We will attempt to drop the check constraint and recreate it, or alter the type
        // PostgreSQL way:
        await sequelize.query(`
      ALTER TYPE "enum_Knowledgebases_status" ADD VALUE IF NOT EXISTS 'published';
      ALTER TYPE "enum_Knowledgebases_status" ADD VALUE IF NOT EXISTS 'draft';
      ALTER TYPE "enum_Knowledgebases_status" ADD VALUE IF NOT EXISTS 'archived';
    `);

        console.log('✅ Enum values ensured.');
    } catch (error) {
        console.error('❌ Error fixing enum:', error.message);
    }
}

fixEnum();
