const UserActivity = require('../../modules/admin/UserActivity');
const geoip = require('geoip-lite'); // We will need to install this or handle missing dep

const tracker = async (req, res, next) => {
    const start = Date.now();

    // Capture original end function to intercept response finish
    const originalEnd = res.end;

    res.end = function (...args) {
        const duration = Date.now() - start;

        // Don't await this, let it run in background to avoid slowing down response
        (async () => {
            try {
                // Skip logging for static assets or health checks to reduce noise
                if (req.originalUrl.startsWith('/uploads') || req.originalUrl.includes('/health')) {
                    return;
                }

                // Get IP
                const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
                const cleanIp = ip && ip.includes(',') ? ip.split(',')[0].trim() : ip;

                // Geo Lookup (Optional - requires geoip-lite)
                let location = null;
                try {
                    const geo = geoip.lookup(cleanIp);
                    if (geo) {
                        location = {
                            country: geo.country,
                            region: geo.region,
                            city: geo.city
                        };
                    }
                } catch {
                    // Ignore geo error
                }

                // Get User ID from request if authenticated
                const userId = req.user ? req.user.id : null;

                await UserActivity.create({
                    userId,
                    ipAddress: cleanIp,
                    method: req.method,
                    route: req.originalUrl,
                    userAgent: req.headers['user-agent'],
                    location,
                    statusCode: res.statusCode,
                    duration
                });
            } catch (err) {
                console.error('Tracking Error:', err.message);
            }
        })();

        originalEnd.apply(res, args);
    };

    next();
};

module.exports = tracker;
