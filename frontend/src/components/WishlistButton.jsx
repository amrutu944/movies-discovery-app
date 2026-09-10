import { useState } from 'react';

export default function WishlistButton({ active, onClick, className = '' }) {
  const [pending, setPending] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    try {
      await onClick();
    } catch {
      // context already rolls back state; nothing extra to do here
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`wishlist-btn ${active ? 'wishlist-btn--active' : ''} ${className}`}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      disabled={pending}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M12 21s-6.716-4.35-9.428-8.06C.29 9.61 1.02 5.5 4.5 4.09c2.1-.85 4.36-.1 5.5 1.6.28.42.5.87.66 1.34.16-.47.38-.92.66-1.34 1.14-1.7 3.4-2.45 5.5-1.6 3.48 1.41 4.21 5.52 1.93 8.85C18.716 16.65 12 21 12 21z"/>
      </svg>
    </button>
  );
}
