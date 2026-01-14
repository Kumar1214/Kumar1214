const Notification = require('./Notification');
const { Op } = require('sequelize');

/**
 * NotificationService
 * centralized service for dispatching in-app notifications
 */
class NotificationService {

    /**
     * Send a notification to all Admins
     * @param {string} title 
     * @param {string} message 
     * @param {string} type - 'info', 'success', 'warning', 'error'
     */
    async notifyAdmins(title, message, type = 'info') {
        try {
            // Needed: A way to identify admins. 
            // For now, we will fetch users with role 'admin'
            // We need to require User model dynamically to avoid circular deps if any
            const User = require('../identity/User');

            const admins = await User.findAll({ where: { role: 'admin' } });

            if (!admins.length) {
                console.warn('[NotificationService] No admins found to notify.');
                return;
            }

            const notifications = admins.map(admin => ({
                recipient: admin.id,
                message: `${title}: ${message}`,
                type: type,
                read: false,
                data: { title, timestamp: new Date() }
            }));

            await Notification.bulkCreate(notifications);
            console.log(`[NotificationService] Sent "${type}" alert to ${admins.length} admins.`);

        } catch (error) {
            console.error('[NotificationService] Failed to notify admins:', error);
        }
    }

    /**
     * Create a notification for a specific user
     */
    async notifyUser(userId, message, type = 'info') {
        try {
            await Notification.create({
                recipient: userId,
                message,
                type,
                read: false
            });
        } catch (error) {
            console.error(`[NotificationService] Failed to notify user ${userId}:`, error);
        }
    }
}

module.exports = new NotificationService();
