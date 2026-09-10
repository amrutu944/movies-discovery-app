import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import WishlistButton from './WishlistButton';

export default function MovieCard({ movie }) {
  const { isWishlisted, toggle } = useWishlist();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card__link">
        <div className="movie-card__poster-wrap">
          {movie.posterUrl && !imgError ? (
            <img
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              className="movie-card__poster"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="movie-card__poster movie-card__poster--placeholder">
              <span>{movie.title}</span>
            </div>
          )}
          {movie.rating != null && (
            <div className={`movie-card__rating ${ratingClass(movie.rating)}`}>{movie.rating.toFixed(1)}</div>
          )}
        </div>
        <div className="movie-card__body">
          <h3 className="movie-card__title" title={movie.title}>
            {movie.title}
          </h3>
          <div className="movie-card__meta">
            <span>{movie.releaseYear || '—'}</span>
            {movie.genres?.[0] && <span className="movie-card__dot">•</span>}
            {movie.genres?.[0] && <span>{movie.genres[0]}</span>}
          </div>
        </div>
      </Link>
      <WishlistButton
        active={isWishlisted(movie.id)}
        onClick={() => toggle(movie)}
        className="movie-card__wishlist-btn"
      />
    </div>
  );
}

function ratingClass(rating) {
  if (rating >= 7) return 'movie-card__rating--good';
  if (rating >= 5) return 'movie-card__rating--mid';
  return 'movie-card__rating--low';
}
