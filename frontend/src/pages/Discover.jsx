import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { discoverMovies, fetchGenres, fetchTrending } from '../api/movies';
import MovieGrid from '../components/MovieGrid';
import FilterBar from '../components/FilterBar';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const initialFilters = { genre: '', year: '', sort: 'popularity' };

export default function Discover() {
  const [genres, setGenres] = useState([]);
  const [trending, setTrending] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const requestIdRef = useRef(0);

  // Load genres + trending strip once
  useEffect(() => {
    fetchGenres().then((d) => setGenres(d.genres)).catch(() => {});
    fetchTrending().then((d) => setTrending(d.results.slice(0, 10))).catch(() => {});
  }, []);

  const loadPage = useCallback(
    (targetFilters, targetPage) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const myRequestId = ++requestIdRef.current;

      const isFirstPage = targetPage === 1;
      isFirstPage ? setLoading(true) : setLoadingMore(true);
      setError(null);

      discoverMovies({ ...targetFilters, page: targetPage }, controller.signal)
        .then((data) => {
          if (myRequestId !== requestIdRef.current) return; // stale response, e.g. filters changed mid-flight
          setMovies((prev) => (isFirstPage ? data.results : [...prev, ...data.results]));
          setTotalPages(data.totalPages);
          setPage(data.page);
        })
        .catch((err) => {
          if (err.name === 'AbortError' || myRequestId !== requestIdRef.current) return;
          setError(err.message || 'Could not load movies.');
        })
        .finally(() => {
          if (myRequestId !== requestIdRef.current) return;
          setLoading(false);
          setLoadingMore(false);
        });
    },
    []
  );

  // Re-fetch from page 1 whenever filters change
  useEffect(() => {
    loadPage(filters, 1);
    return () => abortRef.current?.abort();
  }, [filters, loadPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || page >= totalPages) return;
    loadPage(filters, page + 1);
  }, [loading, loadingMore, page, totalPages, filters, loadPage]);

  const sentinelRef = useInfiniteScroll({ onIntersect: loadMore, enabled: !loading && page < totalPages });

  return (
    <div className="page discover-page">
      {trending.length > 0 && (
        <section className="trending-strip">
          <h2>Trending this week</h2>
          <div className="trending-strip__scroller">
            {trending.map((m) => (
              <Link key={m.id} to={`/movie/${m.id}`} className="trending-strip__item">
                {m.posterUrl ? <img src={m.posterUrl} alt={m.title} loading="lazy" /> : <div className="trending-strip__placeholder">{m.title}</div>}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="page__header">
        <h1>Discover Movies</h1>
        <FilterBar genres={genres} filters={filters} onChange={setFilters} />
      </div>

      {error && movies.length === 0 && <ErrorState message={error} onRetry={() => loadPage(filters, 1)} />}

      {!error && !loading && movies.length === 0 && (
        <EmptyState
          title="No movies match those filters"
          message="Try a different genre, year, or clear your filters."
          action={
            <button className="btn btn--primary" onClick={() => setFilters(initialFilters)}>
              Clear filters
            </button>
          }
        />
      )}

      {movies.length > 0 && <MovieGrid movies={movies} loading={loading || loadingMore} />}
      {loading && movies.length === 0 && <MovieGrid movies={[]} loading />}

      {error && movies.length > 0 && (
        <div className="inline-error">
          {error} <button onClick={() => loadPage(filters, page)}>Retry</button>
        </div>
      )}

      <div ref={sentinelRef} className="scroll-sentinel" />
    </div>
  );
}
