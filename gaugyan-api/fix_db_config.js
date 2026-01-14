const fs = require('fs');
const path = require('path');

const dbConfigPath = path.join(__dirname, 'src/shared/config/db.js');

const newContent = `const mongoose = require('mongoose');

const connectDB = async (retryCount = 0) => {
    const maxRetries = 5; // Increased retries
    const retryDelay = 5000; // 5 seconds

    try {
        // Log sanitized connection attempt
        const sanitizedUri = process.env.MONGODB_URI
            ? process.env.MONGODB_URI.replace(/\\/\\/([^:]+):([^@]+)@/, '//***:***@')
            : 'NOT SET';

        console.log(\`[DB] Attempting MongoDB connection (attempt \${retryCount + 1}/\${maxRetries + 1})...\`);
        console.log(\`[DB] Connection URI: \${sanitizedUri}\`);

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000, // Increased to 30s (Default)
            socketTimeoutMS: 45000, 
            connectTimeoutMS: 30000, // Increased to 30s
            family: 4 // Force IPv4
        });

        console.log(\`[DB] ✅ MongoDB Connected Successfully: \${conn.connection.host}\`);
        console.log(\`[DB] Database: \${conn.connection.name}\`);
        return conn;
    } catch (error) {
        console.error(\`[DB] ❌ MongoDB Connection Error (attempt \${retryCount + 1}/\${maxRetries + 1}):\`, error.message);

        if (retryCount < maxRetries) {
            const delay = retryDelay;
            console.log(\`[DB] Retrying in \${delay / 1000} seconds...\`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return connectDB(retryCount + 1);
        }

        console.error('[DB] ❌ Max retries reached. MongoDB connection failed.');
        return null;
    }
};

module.exports = connectDB;
`;

try {
    fs.writeFileSync(dbConfigPath, newContent);
    console.log('✅ Successfully updated src/shared/config/db.js with longer timeouts!');
} catch (err) {
    console.error('❌ Failed to update file:', err.message);
}
