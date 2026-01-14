const { sequelize } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');
const bcrypt = require('bcryptjs');

const resetAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('[Reset] DB Connected.');

        await sequelize.sync({ alter: false });

        const email = 'admin@gaugyan.com';
        const newPassword = 'password123';

        let user = await User.findOne({ where: { email } });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (user) {
            console.log(`[Reset] User ${email} found. Updating password...`);
            user.password = hashedPassword;
            await user.save();
            console.log('[Reset] Password UPDATED successfully.');
        } else {
            console.log(`[Reset] User ${email} NOT found. Creating...`);
            await User.create({
                name: 'Admin User',
                email: email,
                password: hashedPassword,
                role: 'admin',
                mobile: '9876543210'
            });
            console.log('[Reset] Admin CREATED successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('[Reset] Error:', error);
        process.exit(1);
    }
};

resetAdmin();
