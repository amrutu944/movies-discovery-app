import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as wishlistApi from '../api/wishlist';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    wishlistApi
      .fetchWishlist()
      .then((data) => setItems(data.items))
      .catch(() => setError('Could not load your wishlist.'))
      .finally(() => setLoaded(true));
  }, []);

  const idSet = useMemo(() => new Set(items.map((i) => i.movieId)), [items]);

  const isWishlisted = useCallback((movieId) => idSet.has(movieId), [idSet]);

  // Optimistic add: update the UI immediately, then reconcile with the
  // server. If the request fails we roll back and surface the error,
  // rather than leaving the UI in a state that doesn't match the backend.
  const add = useCallback(async (movie) => {
    setItems((prev) => [
      { movieId: movie.id, title: movie.title, posterPath: movie.posterUrl, releaseYear: movie.releaseYear, voteAverage: movie.rating, addedAt: new Date().toISOString() },
      ...prev,
    ]);
    try {
      const data = await wishlistApi.addToWishlist(movie);
      setItems(data.items);
    } catch (err) {
      setItems((prev) => prev.filter((i) => i.movieId !== movie.id));
      throw err;
    }
  }, []);

  const remove = useCallback(async (movieId) => {
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.movieId !== movieId));
    try {
      const data = await wishlistApi.removeFromWishlist(movieId);
      setItems(data.items);
    } catch (err) {
      setItems(prevItems);
      throw err;
    }
  }, [items]);

  const toggle = useCallback(
    async (movie) => {
      if (isWishlisted(movie.id)) {
        await remove(movie.id);
      } else {
        await add(movie);
      }
    },
    [isWishlisted, add, remove]
  );

  const value = useMemo(
    () => ({ items, loaded, error, isWishlisted, add, remove, toggle }),
    [items, loaded, error, isWishlisted, add, remove, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}
