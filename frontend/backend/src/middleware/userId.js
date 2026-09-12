const AppError = require('../utils/AppError');

// The frontend generates a UUID on first load (see frontend/src/api/client.js)
// and stores it in localStorage, then sends it on every request as
// X-User-Id. This gives each browser a stable identity for wishlist
// persistence without requiring a full login system, which is out of
// scope for this exercise but would replace this header with a real
// authenticated user id.
module.exports = function userId(req, res, next) {
  const id = req.header('X-User-Id');
  if (!id || typeof id !== 'string' || id.length > 100) {
    throw new AppError('Missing or invalid X-User-Id header.', 400, 'MISSING_USER_ID');
  }
  req.userId = id;
  next();
};
