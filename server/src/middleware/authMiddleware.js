const jwt = require('jsonwebtoken');
const { db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'saas_template_store_secret_jwt_key_2026_xyz123';

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user from DB to ensure user still exists
    const user = await db('users').where({ id: decoded.id }).first();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: User no longer exists.'
      });
    }

    // Attach user (without password) to req
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.'
    });
  }
}

// Optional auth helper: if token is present, decode and attach user, but don't block if absent
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await db('users').where({ id: decoded.id }).first();
      if (user) {
        req.user = {
          id: user.id,
          name: user.name,
          email: user.email
        };
      }
    }
  } catch (err) {
    // Ignore invalid token in optional auth
  }
  next();
}

module.exports = {
  authenticateToken,
  optionalAuth
};
