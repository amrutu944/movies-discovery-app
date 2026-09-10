import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

export default function MovieGrid({ movies, loading, skeletonCount = 12 }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
      {loading && Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={`s-${i}`} />)}
    </div>
  );
}
