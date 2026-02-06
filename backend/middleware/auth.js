/**
 * JWT Authentication Middleware
 * Verifies JWT tokens for protected admin routes
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens
 * Checks Authorization header or cookies for token
 */
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header (Bearer token) or cookies
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'arena_x6_default_secret_key_2026_change_in_production';
    const decoded = jwt.verify(token, jwtSecret);
    req.admin = decoded; // Attach admin info to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid or malformed token.'
    });
  }
};

module.exports = { authenticateToken };
