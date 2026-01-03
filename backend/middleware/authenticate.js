const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function authenticate(req, res, next) {
  const auth = req.header('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.id;
      return next();
    } catch (e) {
      return res.status(401).json({ error: 'invalid token' });
    }
  }
  // fallback to dev header
  const headerId = req.header('x-user-id');
  if (headerId) {
    req.userId = Number(headerId);
    return next();
  }
  return res.status(401).json({ error: 'authentication required' });
}

module.exports = authenticate;
