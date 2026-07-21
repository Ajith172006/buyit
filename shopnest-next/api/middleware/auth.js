/**
 * Simple API key middleware for protecting admin-only Express routes.
 * In production, replace with a proper JWT strategy.
 *
 * Set ADMIN_API_KEY in your environment variables.
 * Clients must send: Authorization: Bearer <ADMIN_API_KEY>
 */

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'changeme-in-production';

function requireAdminKey(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || token !== ADMIN_API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: valid admin API key required',
    });
  }
  next();
}

module.exports = { requireAdminKey };
