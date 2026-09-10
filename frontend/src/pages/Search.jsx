import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/movies';
import MovieGrid from '../components/MovieGrid';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const requestIdRef = useRef(0);

  const loadPage = useCallback(
    (q, targetPage) => {
      if (!q) {
        setMovies([]);
        setLoading(false);
        return;
      }
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const myRequestId = ++requestIdRef.current;

      const isFirstPage = targetPage === 1;
      isFirstPage ? setLoading(true) : setLoadingMore(true);
      setError(null);

      searchMovies({ query: q, page: targetPage }, controller.signal)
        .then((data) => {
          if (myRequestId !== requestIdRef.current) return;
          setMovies((prev) => (isFirstPage ? data.results : [...prev, ...data.results]));
          setTotalPages(data.totalPages);
          setTotalResults(data.totalResults);
          setPage(data.page);
        })
        .catch((err) => {
          if (err.name === 'AbortError' || myRequestId !== requestIdRef.current) return;
          setError(err.message || 'Search failed.');
        })
        .finally(() => {
          if (myRequestId !== requestIdRef.current) return;
          setLoading(false);
          setLoadingMore(false);
        });
    },
    []
  );

  useEffect(() => {
    loadPage(query, 1);
    return () => abortRef.current?.abort();
  }, [query, loadPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || page >= totalPages) return;
    loadPage(query, page + 1);
  }, [loading, loadingMore, page, totalPages, query, loadPage]);

  const sentinelRef = useInfiniteScroll({ onIntersect: loadMore, enabled: !loading && page < totalPages });

  if (!query) {
    return (
      <div className="page">
        <EmptyState icon="🔍" title="Search for a movie" message="Use the search bar above to find something to watch." />
      </div>
    );
  }

  return (
    <div className="page search-page">
      <div className="page__header">
        <h1>Results for "{query}"</h1>
        {!loading && <p className="search-page__count">{totalResults.toLocaleString()} results</p>}
      </div>

      {error && movies.length === 0 && <ErrorState message={error} onRetry={() => loadPage(query, 1)} />}

      {!error && !loading && movies.length === 0 && (
        <EmptyState
          title={`No results for "${query}"`}
          message="Try checking your spelling or searching for a different title."
        />
      )}

      {movies.length > 0 && <MovieGrid movies={movies} loading={loading || loadingMore} />}
      {loading && movies.length === 0 && <MovieGrid movies={[]} loading />}

      <div ref={sentinelRef} className="scroll-sentinel" />
    </div>
  );
}
