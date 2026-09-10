const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => currentYear - i);

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title', label: 'Title A–Z' },
];

export default function FilterBar({ genres, filters, onChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        <label htmlFor="genre-select">Genre</label>
        <select
          id="genre-select"
          value={filters.genre}
          onChange={(e) => onChange({ ...filters, genre: e.target.value })}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__group">
        <label htmlFor="year-select">Year</label>
        <select
          id="year-select"
          value={filters.year}
          onChange={(e) => onChange({ ...filters, year: e.target.value })}
        >
          <option value="">Any year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__group">
        <label htmlFor="sort-select">Sort by</label>
        <select
          id="sort-select"
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {(filters.genre || filters.year || filters.sort !== 'popularity') && (
        <button
          type="button"
          className="filter-bar__clear"
          onClick={() => onChange({ genre: '', year: '', sort: 'popularity' })}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
