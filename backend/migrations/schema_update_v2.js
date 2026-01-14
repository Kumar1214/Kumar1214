const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Running migration to add missing columns...');

db.serialize(() => {
    // Add shares column to Knowledgebases (capitalized/plural in local DB)
    db.run("ALTER TABLE Knowledgebases ADD COLUMN shares INTEGER DEFAULT 0", (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            // Try lowercase fallback just in case production DB is different
            db.run("ALTER TABLE knowledgebase ADD COLUMN shares INTEGER DEFAULT 0", (err2) => {
                if (err2 && !err2.message.includes('duplicate column name')) {
                    console.error('Error adding shares column:', err.message);
                } else {
                    console.log('Added shares column to knowledgebase (lowercase)');
                }
            });
        } else {
            console.log('Added shares column to Knowledgebases (or already exists)');
        }
    });

    // Add completions column to Meditations (capitalized/plural in local DB)
    db.run("ALTER TABLE Meditations ADD COLUMN completions INTEGER DEFAULT 0", (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            // Try lowercase fallback
            db.run("ALTER TABLE meditation ADD COLUMN completions INTEGER DEFAULT 0", (err2) => {
                if (err2 && !err2.message.includes('duplicate column name')) {
                    console.error('Error adding completions column:', err.message);
                } else {
                    console.log('Added completions column to meditation (lowercase)');
                }
            });
        } else {
            console.log('Added completions column to Meditations (or already exists)');
        }
    });
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Migration completed.');
    }
});
