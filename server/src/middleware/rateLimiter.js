// Lightweight in-memory rate limiter for authentication routes
const requestCounts = new Map();

function authRateLimiter(windowMs = 15 * 60 * 1000, maxRequests = 50) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    const record = requestCounts.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    requestCounts.set(ip, record);

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many authentication attempts. Please try again after 15 minutes.'
      });
    }

    next();
  };
}

module.exports = { authRateLimiter };
