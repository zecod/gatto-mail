// In-memory rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if an IP address has exceeded the rate limit
 * @param {string} ip - IP address to check
 * @returns {boolean} - True if rate limited
 */
export function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (now - entry.firstRequest > WINDOW_MS) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count += 1;
  return false;
}

/**
 * Express middleware for rate limiting
 */
export function rateLimitMiddleware(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.ip || 'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Try again later.',
    });
  }

  next();
}
