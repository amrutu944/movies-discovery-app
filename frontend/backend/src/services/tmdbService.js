const fetch = require('node-fetch');
const { tmdbBaseUrl, tmdbApiKey } = require('../config/env');
const AppError = require('../utils/AppError');
const cache = require('./cacheService');
const mockData = require('./mockMovieData');

const REQUEST_TIMEOUT_MS = 5000;
const MAX_RETRIES = 1;

function getFallback(endpoint, params = {}) {
  if (endpoint === '/genre/movie/list') {
    return mockData.getMockGenres();
  }
  if (endpoint.startsWith('/trending/movie')) {
    return mockData.getMockTrending();
  }
  if (endpoint === '/discover/movie') {
    return mockData.discoverMockMovies(params);
  }
  if (endpoint === '/search/movie') {
    return mockData.searchMockMovies(params);
  }
  if (endpoint.startsWith('/movie/')) {
    const id = endpoint.split('/')[2];
    return mockData.getMockMovieDetails(id);
  }
  return mockData.getMockTrending();
}

function buildUrl(endpoint, params = {}) {
  const url = new URL(`${tmdbBaseUrl}${endpoint}`);
  url.searchParams.set('api_key', tmdbApiKey || 'demo');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch from TMDB with timeout, retry logic, and seamless fallback to mock data
 * when TMDB is unreachable, rate limited, or missing an API key.
 */
async function rawFetch(endpoint, params, attempt = 0) {
  if (!tmdbApiKey || tmdbApiKey === 'your_tmdb_v3_api_key_here') {
    return getFallback(endpoint, params);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const fetchFn = typeof globalThis.fetch === 'function' ? globalThis.fetch : fetch;
    const response = await fetchFn(buildUrl(endpoint, params), { signal: controller.signal });

    if (response.status === 429 && attempt < MAX_RETRIES) {
      const retryAfter = Number(response.headers.get('retry-after')) || 1;
      await sleep(retryAfter * 1000);
      return rawFetch(endpoint, params, attempt + 1);
    }

    if (response.status >= 500 && attempt < MAX_RETRIES) {
      await sleep(300 * 2 ** attempt);
      return rawFetch(endpoint, params, attempt + 1);
    }

    if (!response.ok) {
      console.warn(`[tmdbService] TMDB API status ${response.status}. Using fallback.`);
      return getFallback(endpoint, params);
    }

    return await response.json();
  } catch (err) {
    console.warn(`[tmdbService] ${err.name || 'Error'}: ${err.message}. Using fallback.`);
    return getFallback(endpoint, params);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Cached wrapper.
 */
async function tmdbGet(endpoint, params = {}, { ttlMs, skipCache = false } = {}) {
  const key = `${endpoint}?${JSON.stringify(params)}`;
  if (skipCache) return rawFetch(endpoint, params);
  return cache.getOrSet(key, () => rawFetch(endpoint, params), ttlMs);
}

module.exports = {
  discoverMovies: (params) => tmdbGet('/discover/movie', params),
  searchMovies: (params) => tmdbGet('/search/movie', params, { ttlMs: 2 * 60 * 1000 }),
  getGenres: () => tmdbGet('/genre/movie/list', {}, { ttlMs: 24 * 60 * 60 * 1000 }),
  getTrending: (window = 'week') => tmdbGet(`/trending/movie/${window}`, {}),
  getMovieDetails: (id) =>
    tmdbGet(`/movie/${id}`, { append_to_response: 'credits,videos,similar' }, { ttlMs: 30 * 60 * 1000 }),
};

