const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const importDB = async () => {
    try {
        // Create connection
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', // Default XAMPP/WAMP password
            multipleStatements: true
        });

        console.log('Connected to MySQL server.');

        // Create DB
        await connection.query('CREATE DATABASE IF NOT EXISTS gaugyanc_gaugyanworld');
        console.log('Database gaugyanc_gaugyanworld created/verified.');

        // Switch to DB
        await connection.changeUser({ database: 'gaugyanc_gaugyanworld' });

        // Read SQL file
        const sqlPath = path.join(__dirname, '..', 'gaugyanc_gaugyanworld.sql');
        console.log(`Reading SQL file from: ${sqlPath}`);

        if (!fs.existsSync(sqlPath)) {
            throw new Error(`SQL file not found at ${sqlPath}. Please ensure the file is in the root directory (parent of backend).`);
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute SQL
        console.log('Importing data... This may take a moment.');
        await connection.query(sql);

        console.log('Database import completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Database Import Failed:', error);
        process.exit(1);
    }
};

importDB();
