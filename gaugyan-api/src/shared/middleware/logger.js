const fs = require('fs');
const path = require('path');

// Logger state
let logStream = null;
let fileLoggingEnabled = false;

// Initialize logger with error handling
function initializeLogger() {
  try {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(__dirname, '../../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Create log file stream
    const logFileName = `${new Date().toISOString().split('T')[0]}.log`;
    const logFilePath = path.join(logsDir, logFileName);
    logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

    // Handle stream errors
    logStream.on('error', (err) => {
      console.error('Logger stream error:', err.message);
      fileLoggingEnabled = false;
    });

    fileLoggingEnabled = true;
    console.log('File logging initialized successfully');
  } catch (error) {
    console.error('Failed to initialize file logging:', error.message);
    console.log('Continuing with console-only logging');
    fileLoggingEnabled = false;
  }
}

// Initialize on module load
initializeLogger();

const logger = (req, res, next) => {
  // Skip logging for health checks and static files
  if (req.url === '/api/health' || req.url.startsWith('/uploads')) {
    return next();
  }

  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  }

  // Log to file if enabled
  if (fileLoggingEnabled && logStream) {
    try {
      const logEntry = `[${timestamp}] ${method} ${url} - IP: ${ip}\n`;
      logStream.write(logEntry);
    } catch (error) {
      console.error('Error writing to log file:', error.message);
      // Don't disable file logging permanently, just skip this entry
    }
  }

  next();
};

// Graceful shutdown
process.on('SIGTERM', () => {
  if (logStream) {
    logStream.end();
  }
});

process.on('SIGINT', () => {
  if (logStream) {
    logStream.end();
  }
});

module.exports = logger;