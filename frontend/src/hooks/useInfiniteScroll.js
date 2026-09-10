import { useEffect, useRef } from 'react';

/**
 * Fires `onIntersect` when the sentinel element scrolls into view, as
 * long as `enabled` is true. Used to load the next page of results
 * without a "Load more" click, while still respecting a loading/end
 * state so we don't fire duplicate requests.
 */
export function useInfiniteScroll({ onIntersect, enabled }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return sentinelRef;
}
