import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Discover from './pages/Discover';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>Movie data provided by TMDB. Built as a product demo — not affiliated with TMDB.</p>
      </footer>
    </div>
  );
}
