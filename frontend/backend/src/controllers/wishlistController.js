const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const selectAllStmt = db.prepare(
  'SELECT movie_id as movieId, title, poster_path as posterPath, release_year as releaseYear, vote_average as voteAverage, added_at as addedAt FROM wishlist WHERE user_id = ? ORDER BY added_at DESC'
);
const insertStmt = db.prepare(
  `INSERT INTO wishlist (user_id, movie_id, title, poster_path, release_year, vote_average)
   VALUES (@userId, @movieId, @title, @posterPath, @releaseYear, @voteAverage)
   ON CONFLICT(user_id, movie_id) DO NOTHING`
);
const deleteStmt = db.prepare('DELETE FROM wishlist WHERE user_id = ? AND movie_id = ?');
const existsStmt = db.prepare('SELECT 1 FROM wishlist WHERE user_id = ? AND movie_id = ?');

// GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const items = selectAllStmt.all(req.userId);
  res.json({ items });
});

// POST /api/wishlist  { movieId, title, posterPath, releaseYear, voteAverage }
const addToWishlist = asyncHandler(async (req, res) => {
  const { movieId, title, posterPath, releaseYear, voteAverage } = req.body || {};
  if (!movieId || !title) {
    throw new AppError('movieId and title are required.', 400, 'MISSING_FIELDS');
  }

  insertStmt.run({
    userId: req.userId,
    movieId,
    title,
    posterPath: posterPath || null,
    releaseYear: releaseYear || null,
    voteAverage: typeof voteAverage === 'number' ? voteAverage : null,
  });

  res.status(201).json({ items: selectAllStmt.all(req.userId) });
});

// DELETE /api/wishlist/:movieId
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  deleteStmt.run(req.userId, movieId);
  res.json({ items: selectAllStmt.all(req.userId) });
});

// GET /api/wishlist/:movieId/status
const getWishlistStatus = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const row = existsStmt.get(req.userId, movieId);
  res.json({ inWishlist: Boolean(row) });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, getWishlistStatus };
