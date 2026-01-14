const { sequelize, connectDB } = require('./src/shared/config/database');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Models
const User = require('./src/modules/identity/User');
const Course = require('./src/modules/learning/Course');
const Music = require('./src/modules/entertainment/Music');
const Podcast = require('./src/modules/entertainment/Podcast');
const Meditation = require('./src/modules/entertainment/Meditation');
const News = require('./src/modules/content/News');
const Knowledgebase = require('./src/modules/content/Knowledgebase');
const Product = require('./src/modules/marketplace/Product');
const Gaushala = require('./src/modules/marketplace/Gaushala');
const GaushalaProfile = require('./src/modules/marketplace/GaushalaProfile');
const Exam = require('./src/modules/learning/Exam');
const Quiz = require('./src/modules/learning/Quiz');
const Notification = require('./src/modules/notifications/Notification');
const Settings = require('./src/modules/core/Settings');
const Banner = require('./src/modules/content/Banner');
const Order = require('./src/modules/marketplace/Order');
const Cart = require('./src/modules/marketplace/Cart');
const Transaction = require('./src/modules/identity/Transaction');
// Add other models if needed

// Data Files
const musicData = require('./data/music');
const podcastData = require('./data/podcasts');
const meditationData = require('./data/meditation');
const newsData = require('./data/news');
const knowledgebaseData = require('./data/knowledgebase');
const gaushalaData = require('./data/gaushala');
const examData = require('./data/exams');
const quizData = require('./data/quizzes');

dotenv.config();

// Image Helper
const getPlaceholder = (type, i) => `https://placehold.co/600x400/2a3b55/ffffff?text=${type}+${i}`;

const importData = async () => {
    try {
        console.log('Connecting to DB...');
        await connectDB();

        console.log('Syncing Database (Force Clean)...');
        // Force sync ensures clean slate
        await sequelize.sync({ force: true });
        console.log('✅ Database Cleared & Synced');

        console.log('Creating users...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await User.bulkCreate([
            { name: 'Admin User', email: 'admin@gaugyan.com', password: hashedPassword, role: 'admin', isVerified: true },
            { name: 'Dr. Rajesh Sharma', email: 'rajesh@gaugyan.com', password: hashedPassword, role: 'instructor', isVerified: true },
            { name: 'Pandit Hariprasad', email: 'pandit@gaugyan.com', password: hashedPassword, role: 'artist', isVerified: true },
            { name: 'Organic Farms India', email: 'vendor1@gaugyan.com', password: hashedPassword, role: 'vendor', isVerified: true },
            { name: 'Gaushala Owner', email: 'gaushala@gaugyan.com', password: hashedPassword, role: 'gaushala_owner', isVerified: true },
            { name: 'Regular User', email: 'user@gaugyan.com', password: hashedPassword, role: 'user', isVerified: true }
        ], { individualHooks: true }); // Hooks for password hashing might run if defined, but we hashed manually to be safe or if bulkCreate skips hooks by default without option

        // If hooks run, we might double hash? 
        // User model has beforeSave hook.
        // sequelize.bulkCreate runs hooks if { individualHooks: true } is set, otherwise not.
        // If we set individualHooks: true, the beforeSave will run.
        // In beforeSave: if (user.changed('password')) ...
        // Since we are creating, it is changed.
        // So we should pass plain password if we use hooks, OR pass hashed and ensure hook doesn't re-hash if already hashed?
        // Hook logic: `if (user.changed('password'))`
        // Validation: len 6. Hashed is long.
        // Safest: Use hooks and plain password.

        // Let's re-do users with plain password and individualHooks: true
    } catch (err) {
        console.error(err);
    }
};

// ... Wait, I should write the full content.
// I will refine the users part in the actual tool call.

/* ... */
