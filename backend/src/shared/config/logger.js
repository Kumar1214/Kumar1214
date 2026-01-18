const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log directory
const logDir = path.join(process.cwd(), 'logs');

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    const msg = typeof message === 'object' ? JSON.stringify(message) : message;
    return `[${timestamp}] ${level.toUpperCase()}: ${msg}`;
});

// Configure Winston Logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Console Transport (for development/debugging)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            ),
            handleExceptions: true // Handle uncaught exceptions in console
        }),
        // Daily Rotate File Transport (for production/persistence)
        new DailyRotateFile({
            filename: path.join(logDir, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true, // Compress old logs
            maxSize: '20m',      // Rotate if file exceeds 20MB
            maxFiles: '14d',     // Keep logs for 14 days then delete
            level: 'info'
        }),
        // Separate Error Log
        new DailyRotateFile({
            filename: path.join(logDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'error'
        })
    ],
    // Prevent exit on handled exceptions so we can log them properly before crashing if needed
    exitOnError: false
});

// Stream for Morgan (if used)
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};

module.exports = logger;
