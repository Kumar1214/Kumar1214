
const { sequelize, connectDB } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');
// const Course = require('./src/modules/learning/Course'); // Ensure these paths exist or comment out if not needed for basic test
// For now, I only need Users to verify the "Users not visible" fix.
// And Exams/Quizzes for the "Glitch" check.

// Helper to safe require
const safeRequire = (path) => {
    try {
        return require(path);
    } catch (e) {
        console.warn(`Could not load model at ${path}: ${e.message}`);
        return null;
    }
};

const Course = safeRequire('./src/modules/learning/Course');
const Exam = safeRequire('./src/modules/learning/Exam');
const Quiz = safeRequire('./src/modules/learning/Quiz');
const GaushalaProfile = safeRequire('./src/modules/marketplace/GaushalaProfile');

const seedData = async () => {
    try {
        await connectDB();
        await sequelize.sync({ force: true });
        console.log('Synced DB');

        const users = await User.bulkCreate([
            { name: 'Admin User', email: 'admin@gaugyan.com', password: 'password123', role: 'admin', isVerified: true },
            { name: 'Test Instructor', email: 'instructor@test.com', password: 'password123', role: 'instructor', isVerified: true },
            { name: 'Test Student', email: 'student@test.com', password: 'password123', role: 'user', isVerified: true }
        ], { individualHooks: true });

        console.log('Users created');

        if (Exam) {
            await Exam.create({
                title: 'Test Exam 1',
                description: 'Description',
                duration: 60,
                passingMarks: 50,
                price: 0,
                category: 'General',
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000),
                resultDate: new Date(Date.now() + 172800000),
                status: 'published',
                instructorId: users[1].id
            });
            console.log('Exam created');
        }

        if (Quiz) {
            await Quiz.create({
                title: 'Test Quiz 1',
                description: 'Description',
                duration: 10,
                passingMarks: 5,
                category: 'General',
                difficulty: 'Easy',
                instructorId: users[1].id
            });
            console.log('Quiz created');
        }

        console.log('Seeding Complete');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedData();
