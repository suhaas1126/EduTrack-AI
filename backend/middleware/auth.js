const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let dbUser;
      try {
        dbUser = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        dbUser = null;
      }

      if (!dbUser) {
        req.user = {
          id: decoded.id,
          name: decoded.name || 'Campus User',
          email: decoded.email,
          role: decoded.role || 'student',
        };
      } else {
        req.user = dbUser;
      }

      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
