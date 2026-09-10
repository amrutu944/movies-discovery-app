export default function SkeletonCard() {
  return (
    <div className="movie-card movie-card--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--poster" />
      <div className="movie-card__body">
        <div className="skeleton skeleton--line skeleton--line-wide" />
        <div className="skeleton skeleton--line skeleton--line-narrow" />
      </div>
    </div>
  );
}
