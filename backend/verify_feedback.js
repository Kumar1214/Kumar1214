const { sequelize } = require('./src/shared/config/database');
const Feedback = require('./src/modules/communication/Feedback');

const verifyFeedback = async () => {
    try {
        console.log('Connecting to DB...');
        await sequelize.authenticate();
        // Force sync to apply 'alter: true' if not already picked up by server
        await sequelize.sync({ alter: true });
        console.log('DB Connected and Synced.');

        // list existing
        const existing = await Feedback.findAll();
        console.log(`Found ${existing.length} existing feedbacks.`);
        existing.forEach(f => console.log(` - [${f.id}] ${f.subject} (Cat: ${f.category}, Rate: ${f.rating})`));

        // Create new
        console.log('Creating test feedback...');
        const newFeedback = await Feedback.create({
            name: 'Verification Bot',
            email: 'bot@verify.com',
            subject: 'Schema Test',
            message: 'Testing category and rating fields.',
            category: 'technical',
            rating: 5,
            status: 'new'
        });

        console.log('Created:', newFeedback.toJSON());

        // Verify save
        const saved = await Feedback.findByPk(newFeedback.id);
        if (saved.category === 'technical' && saved.rating === 5) {
            console.log('✅ SUCCESS: Feedback saved with new fields!');
        } else {
            console.log('❌ FAILURE: Fields mismatch:', saved.toJSON());
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

verifyFeedback();
