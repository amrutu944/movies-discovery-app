import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import EmptyState from '../components/EmptyState';
import WishlistButton from '../components/WishlistButton';

export default function Wishlist() {
  const { items, loaded, error, remove } = useWishlist();

  return (
    <div className="page">
      <div className="page__header">
        <h1>Your Wishlist</h1>
      </div>

      {!loaded && <p className="muted">Loading your wishlist…</p>}

      {loaded && error && <p className="inline-error">{error}</p>}

      {loaded && !error && items.length === 0 && (
        <EmptyState
          icon="🍿"
          title="Your wishlist is empty"
          message="Movies you save will show up here, even after you close the app."
          action={
            <Link to="/" className="btn btn--primary">
              Discover movies
            </Link>
          }
        />
      )}

      {items.length > 0 && (
        <div className="movie-grid">
          {items.map((item) => (
            <div className="movie-card" key={item.movieId}>
              <Link to={`/movie/${item.movieId}`} className="movie-card__link">
                <div className="movie-card__poster-wrap">
                  {item.posterPath ? (
                    <img src={item.posterPath} alt={`${item.title} poster`} className="movie-card__poster" loading="lazy" />
                  ) : (
                    <div className="movie-card__poster movie-card__poster--placeholder">
                      <span>{item.title}</span>
                    </div>
                  )}
                  {item.voteAverage != null && <div className="movie-card__rating">{item.voteAverage.toFixed(1)}</div>}
                </div>
                <div className="movie-card__body">
                  <h3 className="movie-card__title" title={item.title}>
                    {item.title}
                  </h3>
                  <div className="movie-card__meta">
                    <span>{item.releaseYear || '—'}</span>
                  </div>
                </div>
              </Link>
              <WishlistButton active onClick={() => remove(item.movieId)} className="movie-card__wishlist-btn" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
