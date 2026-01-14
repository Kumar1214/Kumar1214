const User = require('../identity/User');
const { sendEmail } = require('../../shared/services/email.service');
const { Op } = require('sequelize');

/**
 * Send Bulk Email to a target audience
 */
const sendBulkEmail = async (req, res) => {
    try {
        const { role, subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ success: false, message: 'Subject and content are required' });
        }

        let query = {};
        // If role is provided and not 'all', filter by role
        if (role && role !== 'all') {
            const allowedRoles = ['user', 'vendor', 'admin', 'author', 'instructor', 'gaushala_owner', 'artist'];
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ success: false, message: 'Invalid role' });
            }
            query.role = role;
        }

        // Fetch users
        // Use streaming or batching for large datasets in production. 
        // For now, fetching all relevant emails.
        const users = await User.findAll({
            where: query,
            attributes: ['email', 'name']
        });

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found for this audience' });
        }

        console.log(`Starting bulk email to ${users.length} users. Subject: ${subject}`);

        // Send emails in background (async loop)
        // Note: In production, use a Message Queue (RabbitMQ/Bull) to prevent timeout
        let sentCount = 0;
        let failedCount = 0;

        // Responding immediately to admin while processing in background
        res.json({
            success: true,
            message: `Bulk email process started for ${users.length} recipients.`,
            recipientCount: users.length
        });

        // Background processing
        (async () => {
            for (const user of users) {
                // Determine content (simple replace for now)
                let personalizedMessage = message.replace(/{{name}}/g, user.name || 'User');

                try {
                    await sendEmail({
                        to: user.email,
                        subject: subject,
                        html: personalizedMessage
                    });
                    sentCount++;
                } catch (err) {
                    console.error(`Failed to email ${user.email}:`, err.message);
                    failedCount++;
                }

                // Simple throttle to be nice to SMTP
                await new Promise(r => setTimeout(r, 100));
            }
            console.log(`Bulk email complete. Sent: ${sentCount}, Failed: ${failedCount}`);
        })();

    } catch (error) {
        console.error('Bulk email error:', error);
        // If we haven't responded yet
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Server error processing bulk email' });
        }
    }
};

module.exports = {
    sendBulkEmail
};
