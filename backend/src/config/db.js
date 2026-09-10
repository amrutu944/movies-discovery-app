const path = require('path');
const fs = require('fs');
const { dbPath } = require('./env');

let db;

try {
  const Database = require('better-sqlite3');
  const targetDbPath = process.env.VERCEL ? '/tmp/wishlist.db' : dbPath;
  const resolvedPath = path.isAbsolute(targetDbPath) ? targetDbPath : path.join(__dirname, '..', '..', targetDbPath);
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(resolvedPath);
  db.pragma('journal_mode = WAL');

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
} catch (err) {
  console.warn('[db] better-sqlite3 native bindings not available, using in-memory store fallback:', err.message);
  const memoryStore = new Map();

  db = {
    pragma: () => {},
    exec: () => {},
    prepare: (sql) => {
      const isSelectAll = sql.includes('SELECT movie_id');
      const isInsert = sql.includes('INSERT INTO');
      const isDelete = sql.includes('DELETE FROM');
      const isExists = sql.includes('SELECT 1 FROM');

      return {
        all: (userId) => {
          if (isSelectAll) {
            const results = [];
            for (const item of memoryStore.values()) {
              if (item.user_id === userId) {
                results.push({
                  movieId: item.movie_id,
                  title: item.title,
                  posterPath: item.poster_path,
                  releaseYear: item.release_year,
                  voteAverage: item.vote_average,
                  addedAt: item.added_at,
                });
              }
            }
            return results.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
          }
          return [];
        },
        run: (params, arg2) => {
          if (isInsert && typeof params === 'object') {
            const key = `${params.userId}:${params.movieId}`;
            if (!memoryStore.has(key)) {
              memoryStore.set(key, {
                user_id: params.userId,
                movie_id: params.movieId,
                title: params.title,
                poster_path: params.posterPath,
                release_year: params.releaseYear,
                vote_average: params.voteAverage,
                added_at: new Date().toISOString(),
              });
            }
          } else if (isDelete) {
            const userId = params;
            const movieId = arg2;
            const key = `${userId}:${movieId}`;
            memoryStore.delete(key);
          }
          return { changes: 1 };
        },
        get: (userId, movieId) => {
          if (isExists) {
            const key = `${userId}:${movieId}`;
            return memoryStore.has(key) ? { 1: 1 } : undefined;
          }
          return undefined;
        },
      };
    },
  };
}

module.exports = db;
