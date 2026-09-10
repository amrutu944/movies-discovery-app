import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../api/movies';
import { useWishlist } from '../context/WishlistContext';
import WishlistButton from '../components/WishlistButton';
import ErrorState from '../components/ErrorState';
import MovieGrid from '../components/MovieGrid';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isWishlisted, toggle } = useWishlist();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setMovie(null);
    fetchMovieDetails(id, controller.signal)
      .then(setMovie)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Could not load this movie.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="details-skeleton">
          <div className="skeleton skeleton--backdrop" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <ErrorState message={error} onRetry={() => navigate(0)} />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="details-page">
      <div
        className="details-hero"
        style={movie.backdropUrl ? { backgroundImage: `url(${movie.backdropUrl})` } : undefined}
      >
        <div className="details-hero__overlay" />
        <div className="details-hero__content">
          <button className="back-link" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="details-hero__main">
            {movie.posterUrl && <img src={movie.posterUrlLarge || movie.posterUrl} alt={`${movie.title} poster`} className="details-hero__poster" />}
            <div className="details-hero__info">
              <h1>{movie.title}</h1>
              {movie.tagline && <p className="details-hero__tagline">{movie.tagline}</p>}
              <div className="details-hero__meta">
                {movie.releaseYear && <span>{movie.releaseYear}</span>}
                {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
                {movie.rating != null && <span className="details-hero__rating">★ {movie.rating.toFixed(1)}</span>}
              </div>
              <div className="details-hero__genres">
                {movie.genres.map((g) => (
                  <span key={g} className="tag">
                    {g}
                  </span>
                ))}
              </div>
              <div className="details-hero__actions">
                <WishlistButton active={isWishlisted(movie.id)} onClick={() => toggle(movie)} className="wishlist-btn--large" />
                <span className="details-hero__actions-label">
                  {isWishlisted(movie.id) ? 'On your wishlist' : 'Add to wishlist'}
                </span>
                {movie.trailerKey && (
                  <a
                    className="btn btn--primary"
                    href={`https://www.youtube.com/watch?v=${movie.trailerKey}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ▶ Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="details-body">
        <section className="details-section">
          <h2>Overview</h2>
          <p>{movie.overview || 'No overview available.'}</p>
          {movie.director && (
            <p className="details-director">
              <strong>Director:</strong> {movie.director}
            </p>
          )}
        </section>

        {movie.cast?.length > 0 && (
          <section className="details-section">
            <h2>Cast</h2>
            <div className="cast-scroller">
              {movie.cast.map((c) => (
                <div key={c.id} className="cast-card">
                  {c.profileUrl ? (
                    <img src={c.profileUrl} alt={c.name} loading="lazy" />
                  ) : (
                    <div className="cast-card__placeholder">{c.name[0]}</div>
                  )}
                  <div className="cast-card__name">{c.name}</div>
                  <div className="cast-card__character">{c.character}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {movie.similar?.length > 0 && (
          <section className="details-section">
            <h2>You might also like</h2>
            <MovieGrid movies={movie.similar} loading={false} />
          </section>
        )}
      </div>
    </div>
  );
}

function formatRuntime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}
