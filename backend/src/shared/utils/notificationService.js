const Notification = require('../../modules/notifications/Notification');
const User = require('../../modules/identity/User');

/**
 * Create a notification for a specific user
 * @param {number} userId - The recipient's user ID
 * @param {string} message - The notification message
 * @param {string} type - The type of notification (info, success, warning, error)
 * @param {object} data - Additional data
 */
exports.createNotification = async (userId, message, type = 'info', data = {}) => {
    try {
        await Notification.create({
            recipient: userId,
            message,
            type,
            data,
            read: false
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

/**
 * Create a notification for all admins
 * @param {string} message - The notification message
 * @param {string} type - The type of notification
 * @param {object} data - Additional data
 */
exports.notifyAdmins = async (message, type = 'info', data = {}) => {
    try {
        // Find all users with role 'admin'
        const admins = await User.findAll({ where: { role: 'admin' } });

        if (!admins.length) return;

        const notifications = admins.map(admin => ({
            recipient: admin.id,
            message,
            type,
            data,
            read: false
        }));

        await Notification.bulkCreate(notifications);
    } catch (error) {
        console.error('Error notifying admins:', error);
    }
};
