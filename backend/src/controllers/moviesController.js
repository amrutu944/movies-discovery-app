const tmdb = require('../services/tmdbService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { transformMovieSummary, transformMovieDetails } = require('../utils/transformMovie');

const SORT_MAP = {
  popularity: 'popularity.desc',
  rating: 'vote_average.desc',
  newest: 'release_date.desc',
  oldest: 'release_date.asc',
  title: 'original_title.asc',
};

async function genreLookupMap() {
  const data = await tmdb.getGenres();
  return Object.fromEntries((data.genres || []).map((g) => [g.id, g.name]));
}

// GET /api/genres
const getGenres = asyncHandler(async (req, res) => {
  const data = await tmdb.getGenres();
  res.json({ genres: data.genres || [] });
});

// GET /api/movies/discover?genre=&sort=&year=&page=
const discoverMovies = asyncHandler(async (req, res) => {
  const { genre, sort = 'popularity', year, page = 1 } = req.query;

  const params = {
    sort_by: SORT_MAP[sort] || SORT_MAP.popularity,
    page,
    with_genres: genre || undefined,
    primary_release_year: year || undefined,
    'vote_count.gte': sort === 'rating' ? 50 : undefined, // avoid single-vote 10/10 noise skewing "top rated"
    include_adult: false,
  };

  const [data, genreMap] = await Promise.all([tmdb.discoverMovies(params), genreLookupMap()]);

  res.json({
    page: data.page,
    totalPages: Math.min(data.total_pages || 1, 500), // TMDB hard-caps pagination at 500 pages
    totalResults: data.total_results || 0,
    results: (data.results || []).map((m) => transformMovieSummary(m, genreMap)),
  });
});

// GET /api/movies/search?q=&page=
const searchMovies = asyncHandler(async (req, res) => {
  const { q, page = 1 } = req.query;
  if (!q || !q.trim()) {
    throw new AppError('A search query is required.', 400, 'MISSING_QUERY');
  }

  const [data, genreMap] = await Promise.all([
    tmdb.searchMovies({ query: q.trim(), page, include_adult: false }),
    genreLookupMap(),
  ]);

  res.json({
    page: data.page,
    totalPages: Math.min(data.total_pages || 1, 500),
    totalResults: data.total_results || 0,
    results: (data.results || []).map((m) => transformMovieSummary(m, genreMap)),
    query: q.trim(),
  });
});

// GET /api/movies/trending
const trendingMovies = asyncHandler(async (req, res) => {
  const [data, genreMap] = await Promise.all([tmdb.getTrending('week'), genreLookupMap()]);
  res.json({ results: (data.results || []).map((m) => transformMovieSummary(m, genreMap)) });
});

// GET /api/movies/:id
const getMovieDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    throw new AppError('Invalid movie id.', 400, 'INVALID_ID');
  }
  const data = await tmdb.getMovieDetails(id);
  res.json(transformMovieDetails(data));
});

module.exports = { getGenres, discoverMovies, searchMovies, trendingMovies, getMovieDetails };
