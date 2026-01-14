require('dotenv').config();
const { sequelize } = require('./src/shared/config/database');
const User = require('./src/modules/identity/User');
const bcrypt = require('bcryptjs');

async function resetPass() {
    try {
        console.log("Resetting Admin Password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Update directly via SQL to avoid hooks if any issues there
        await sequelize.query(
            "UPDATE Users SET password = :password WHERE email = 'admin@gaugyan.com'",
            { replacements: { password: hashedPassword } }
        );
        console.log("Password Reset Successfully to 'admin123'");
        process.exit(0);
    } catch (error) {
        console.error("Reset Failed:", error);
        process.exit(1);
    }
}
resetPass();
