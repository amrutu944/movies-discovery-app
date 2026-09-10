require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // Fail fast and loud rather than limping along with an undefined key
    // that would only surface as a confusing 401 from TMDB later on.
    console.error(`[config] Missing required environment variable: ${name}`);
  }
  return value;
}

module.exports = {
  port: Number(process.env.PORT) || 5005,
  nodeEnv: process.env.NODE_ENV || 'development',
  tmdbApiKey: process.env.TMDB_API_KEY || 'your_tmdb_v3_api_key_here',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()) : '*',
  cacheTtlMs: Number(process.env.CACHE_TTL_MS) || 5 * 60 * 1000,
  dbPath: process.env.DB_PATH || './data/wishlist.db',
};
