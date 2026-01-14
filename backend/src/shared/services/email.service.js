const nodemailer = require('nodemailer');
const Settings = require('../../modules/core/Settings');

/**
 * Send an email using standard SMTP.
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Text content (fallback)
 */
const sendEmail = async ({ to, subject, html, text }) => {
    try {
        // 1. Fetch Email Settings from DB
        const emailSettingsDoc = await Settings.findOne({ where: { category: 'email' } });

        if (!emailSettingsDoc || !emailSettingsDoc.settings) {
            console.warn('Email settings not configured. Email not sent.');
            return false;
        }

        const config = emailSettingsDoc.settings;

        if (!config.smtpHost || !config.smtpUsername || !config.smtpPassword) {
            console.warn('Incomplete SMTP configuration. Email not sent.');
            return false;
        }

        // 2. Create Transporter
        const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: config.smtpPort || 587,
            secure: config.smtpPort == 465, // true for 465, false for other ports
            auth: {
                user: config.smtpUsername,
                pass: config.smtpPassword,
            },
        });

        // 3. Send Email
        const info = await transporter.sendMail({
            from: `"${config.emailFromName || 'GauGyan'}" <${config.emailFrom || config.smtpUsername}>`,
            to,
            subject,
            text,
            html,
        });

        console.log(`Message sent: ${info.messageId}`);
        return true;

    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    sendEmail
};
