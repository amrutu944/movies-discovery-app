const { tmdbImageBaseUrl } = require('../config/env');

function imageUrl(path, size) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${tmdbImageBaseUrl}/${size}${path}`;
}

/**
 * TMDB's raw payload carries a lot of fields the client doesn't need and
 * uses conventions (path fragments instead of URLs, "vote_average" on a
 * 0-10 scale, nullable everything) that we don't want leaking into the
 * frontend. This is the single place that decides the app's own movie
 * shape, so the frontend never has to think about TMDB at all.
 */
function transformMovieSummary(raw, genreMap = {}) {
  if (!raw) return null;
  return {
    id: raw.id,
    title: raw.title || raw.original_title || 'Untitled',
    overview: raw.overview || '',
    posterUrl: imageUrl(raw.poster_path, 'w342'),
    posterUrlLarge: imageUrl(raw.poster_path, 'w500'),
    backdropUrl: imageUrl(raw.backdrop_path, 'w780'),
    releaseDate: raw.release_date || null,
    releaseYear: raw.release_date ? raw.release_date.slice(0, 4) : null,
    rating: typeof raw.vote_average === 'number' ? Math.round(raw.vote_average * 10) / 10 : null,
    voteCount: raw.vote_count ?? 0,
    popularity: raw.popularity ?? 0,
    genreIds: raw.genre_ids || (raw.genres ? raw.genres.map((g) => g.id) : []),
    genres: raw.genre_ids
      ? raw.genre_ids.map((id) => genreMap[id]).filter(Boolean)
      : (raw.genres || []).map((g) => g.name),
    adult: Boolean(raw.adult),
  };
}

function transformMovieDetails(raw) {
  if (!raw) return null;
  const summary = transformMovieSummary(raw);
  return {
    ...summary,
    runtime: raw.runtime ?? null,
    status: raw.status || null,
    tagline: raw.tagline || '',
    genres: (raw.genres || []).map((g) => g.name),
    productionCountries: (raw.production_countries || []).map((c) => c.name),
    spokenLanguages: (raw.spoken_languages || []).map((l) => l.english_name).filter(Boolean),
    homepage: raw.homepage || null,
    budget: raw.budget || 0,
    revenue: raw.revenue || 0,
    cast: (raw.credits?.cast || []).slice(0, 12).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profileUrl: imageUrl(c.profile_path, 'w185'),
    })),
    director: (raw.credits?.crew || []).find((c) => c.job === 'Director')?.name || null,
    trailerKey:
      (raw.videos?.results || []).find((v) => v.site === 'YouTube' && v.type === 'Trailer')?.key ||
      (raw.videos?.results || []).find((v) => v.site === 'YouTube')?.key ||
      null,
    similar: (raw.similar?.results || []).slice(0, 12).map((m) => transformMovieSummary(m)),
  };
}

module.exports = { transformMovieSummary, transformMovieDetails, imageUrl };
