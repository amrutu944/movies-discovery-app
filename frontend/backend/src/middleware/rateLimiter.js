const rateLimit = require('express-rate-limit');

// Protects our own API (and transitively TMDB, which has its own quota)
// from being hammered by a runaway client or bot. This is separate from
// the retry/backoff logic in tmdbService, which handles TMDB rejecting
// us; this stops us from being the thing that needs rejecting.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many requests. Please slow down.', code: 'RATE_LIMITED' } },
});

module.exports = { apiLimiter };
