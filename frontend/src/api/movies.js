import { apiFetch } from './client';

export function fetchGenres(signal) {
  return apiFetch('/genres', { signal });
}

export function fetchTrending(signal) {
  return apiFetch('/movies/trending', { signal });
}

export function discoverMovies({ genre, sort, year, page = 1 }, signal) {
  const params = new URLSearchParams();
  if (genre) params.set('genre', genre);
  if (sort) params.set('sort', sort);
  if (year) params.set('year', year);
  params.set('page', page);
  return apiFetch(`/movies/discover?${params.toString()}`, { signal });
}

export function searchMovies({ query, page = 1 }, signal) {
  const params = new URLSearchParams({ q: query, page });
  return apiFetch(`/movies/search?${params.toString()}`, { signal });
}

export function fetchMovieDetails(id, signal) {
  return apiFetch(`/movies/${id}`, { signal });
}
