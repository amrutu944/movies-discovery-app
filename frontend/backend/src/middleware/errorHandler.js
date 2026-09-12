const AppError = require('../utils/AppError');

// 404 fallback for unmatched routes
function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND'));
}

// Centralized error formatting so every route returns a consistent shape:
// { error: { message, code } }. Unexpected (non-operational) errors are
// logged with full detail server-side but never leak internals to the
// client.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : 'INTERNAL_ERROR';
  const message = isAppError ? err.message : 'Something went wrong. Please try again.';

  if (!isAppError) {
    console.error('[unhandled error]', err);
  }

  res.status(statusCode).json({ error: { message, code } });
}

module.exports = { notFound, errorHandler };
