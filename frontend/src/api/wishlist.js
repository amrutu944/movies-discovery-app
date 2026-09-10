import { apiFetch } from './client';

export function fetchWishlist() {
  return apiFetch('/wishlist');
}

export function addToWishlist(movie) {
  return apiFetch('/wishlist', {
    method: 'POST',
    body: JSON.stringify({
      movieId: movie.id,
      title: movie.title,
      posterPath: movie.posterUrl,
      releaseYear: movie.releaseYear,
      voteAverage: movie.rating,
    }),
  });
}

export function removeFromWishlist(movieId) {
  return apiFetch(`/wishlist/${movieId}`, { method: 'DELETE' });
}
