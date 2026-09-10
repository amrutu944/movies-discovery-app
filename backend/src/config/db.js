const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const { dbPath } = require('./env');

const targetDbPath = process.env.VERCEL ? '/tmp/wishlist.db' : dbPath;
const resolvedPath = path.isAbsolute(targetDbPath) ? targetDbPath : path.join(__dirname, '..', '..', targetDbPath);
const dir = path.dirname(resolvedPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(resolvedPath);
db.pragma('journal_mode = WAL');

// Wishlist rows are scoped by a client-generated userId (see middleware/userId.js)
// rather than full authentication - this keeps the reviewer's setup zero-config
// while still giving each browser/device its own persistent list.
db.exec(`
  CREATE TABLE IF NOT EXISTS wishlist (
    user_id TEXT NOT NULL,
    movie_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    release_year TEXT,
    vote_average REAL,
    added_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, movie_id)
  );

  CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
`);

module.exports = db;
