const rateLimit = require('express-rate-limit');

const hpp = require('hpp');

const { RedisStore } = require('rate-limit-redis');
// const redisClient = require('../config/redis');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 attempts - Relaxed for testing
    standardHeaders: true,
    legacyHeaders: false,
    // store: new RedisStore({
    //     sendCommand: (...args) => redisClient.call(...args),
    // }),
    message: 'Too many login attempts, please try again after 15 minutes'
});

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // 5000 requests per 15 minutes - Significantly increased
    standardHeaders: true,
    legacyHeaders: false,
    // store: new RedisStore({
    //     sendCommand: (...args) => redisClient.call(...args),
    // }),
    message: 'Too many requests, please try again later'
});

// Sanitize data
const sanitizeData = () => {
    return [
        // NoSQL injection protection is less relevant for SQL, but if needed, use other libs
        hpp() // Prevent HTTP parameter pollution
    ];
};

module.exports = {
    loginLimiter,
    apiLimiter,
    sanitizeData
};
