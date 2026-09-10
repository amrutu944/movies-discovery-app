import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setQuery(location.pathname === '/search' ? searchParams.get('q') || '' : '');
  }, [location.pathname, searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar__brand-mark">🎬</span> Reel
        </Link>

        <form className="navbar__search" onSubmit={handleSubmit} role="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            aria-label="Search movies"
          />
          <button type="submit" aria-label="Search">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        <button
          className="navbar__menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((o) => !o)}
        >
          ☰
        </button>

        <nav className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
            Discover
          </Link>
          <Link
            to="/wishlist"
            className={location.pathname === '/wishlist' ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Wishlist
          </Link>
        </nav>
      </div>
    </header>
  );
}
