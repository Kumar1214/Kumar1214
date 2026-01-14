const cron = require('node-cron');
const { fetchExternalNews } = require('./news.service');
const News = require('../../modules/content/News');
const Notification = require('../../modules/notifications/Notification');
const User = require('../../modules/identity/User');
const { sendEmail } = require('./email.service');
const { Op } = require('sequelize');

const startNewsCron = () => {
    console.log('[Cron] News Auto-Fetcher initialized.');

    // Define the sync logic
    const syncNews = async () => {
        console.log('[Cron] Fetching external news...');
        try {
            // Fetch General News (PageSize 10)
            const newsData = await fetchExternalNews({ pageSize: 10 });

            if (newsData.status === 'ok' && newsData.articles.length > 0) {
                console.log(`[Cron] Found ${newsData.articles.length} articles. Processing...`);

                let newCount = 0;
                for (const article of newsData.articles) {
                    // Deduplicate by Title
                    const existing = await News.findOne({
                        where: { title: article.title }
                    });

                    if (!existing) {
                        try {
                            await News.create({
                                title: article.title,
                                excerpt: article.description ? article.description.substring(0, 250) : article.title,
                                content: article.content || article.description || 'Full content pending...',
                                category: 'general',
                                featuredImage: article.urlToImage || 'default-news-image.jpg',
                                author: article.author ? article.author.substring(0, 50) : (article.source?.name || 'NewsAPI'),
                                authorId: 1, // Default Admin ID
                                status: 'published',
                                tags: ['auto-generated', 'news']
                            });
                            newCount++;
                        } catch (err) {
                            console.error(`[Cron] Failed to save article "${article.title}":`, err.message);
                        }
                    }
                }
                console.log(`[Cron] News Sync Complete. Added ${newCount} new articles.`);
            } else {
                console.log('[Cron] No articles found or error in fetch.');
            }
        } catch (error) {
            console.error('[Cron] Error in News Sync:', error.message);
        }
    };

    // Schedule: Every 4 hours
    cron.schedule('0 */4 * * *', syncNews);

    // Initial Run on Startup (Delayed to ensure DB connection)
    setTimeout(() => {
        console.log('[Cron] Triggering initial News Sync...');
        syncNews();
    }, 10000);

    // --- Notification Digest Cron ---
    const sendNotificationDigest = async () => {
        console.log('[Cron] Starting Notification Digest...');
        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

        try {
            // Find unread notifications from last 24h
            const notifications = await Notification.findAll({
                where: {
                    read: false,
                    createdAt: { [Op.gte]: yesterday }
                },
                include: [{ model: User, attributes: ['id', 'email', 'name'] }]
            });

            if (notifications.length === 0) {
                console.log('[Cron] No new notifications to email.');
                return;
            }

            // Group by User
            const userMap = {};
            notifications.forEach(n => {
                if (!n.User || !n.User.email) return;
                if (!userMap[n.User.email]) {
                    userMap[n.User.email] = {
                        user: n.User,
                        items: []
                    };
                }
                userMap[n.User.email].items.push(n);
            });

            // Send Emails
            for (const email of Object.keys(userMap)) {
                const { user, items } = userMap[email];
                const subject = `You have ${items.length} new notifications - GauGyan`;
                const html = `
                    <h3>Hello ${user.name},</h3>
                    <p>You have missed the following updates in the last 24 hours:</p>
                    <ul>
                        ${items.map(i => `<li><strong>${i.type.toUpperCase()}:</strong> ${i.message}</li>`).join('')}
                    </ul>
                    <p><a href="${process.env.CLIENT_URL || 'https://gaugyanworld.org'}/dashboard">Go to Dashboard</a></p>
                `;

                await sendEmail({ to: email, subject, html, text: 'You have new notifications. Please check your dashboard.' });
            }
            console.log(`[Cron] Sent digest emails to ${Object.keys(userMap).length} users.`);

        } catch (error) {
            console.error('[Cron] Notification Digest Error:', error);
        }
    };

    // Schedule: Daily at 9:00 AM
    cron.schedule('0 9 * * *', sendNotificationDigest);
    // cron.schedule('*/5 * * * *', sendNotificationDigest); // Test: Every 5 mins

};

module.exports = startNewsCron;
