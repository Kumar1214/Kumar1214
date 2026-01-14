const jwt = require('jsonwebtoken');
const User = require('../../modules/identity/User');

// Protect routes middleware
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Protect Middleware: Token Decoded:', decoded);

      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        console.log('Protect Middleware: User Not Found for ID:', decoded.id);
        return res.status(401).json({ success: false, message: 'User belonging to token no longer exists' });
      }

      console.log('Protect Middleware: User Role:', req.user.role);
      next();
    } catch (err) {
      console.error('Protect Middleware: Token Verification Failed:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: ' + (err.message || 'Unknown error'),
      stack: err.stack
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`
      });
    }
    next();
  };
};

// Optional Authentication (sets req.user if token valid, else continues)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id);
      next();
    } catch (err) {
      // Invalid token? Just continue as guest
      // console.log('OptionalAuth: Token failed, continuing as guest');
      next();
    }
  } catch (err) {
    next();
  }
};