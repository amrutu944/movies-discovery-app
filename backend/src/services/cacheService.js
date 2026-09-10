const { cacheTtlMs } = require('../config/env');

/**
 * Small in-memory cache with per-key TTL.
 *
 * Why not Redis? For this exercise the app runs as a single Node process,
 * so an in-memory Map gives the same "avoid hammering TMDB for repeated
 * requests" benefit with zero extra infrastructure. Swapping this for a
 * Redis-backed implementation later is a drop-in change because the rest
 * of the app only talks to the three methods below.
 */
class CacheService {
  constructor(ttlMs = cacheTtlMs) {
    this.ttlMs = ttlMs;
    this.store = new Map();
    // In-flight request de-duplication: if two identical requests land
    // within milliseconds of each other (e.g. React StrictMode double
    // render, or a user double-clicking), we only hit TMDB once.
    this.inFlight = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key, value, ttlMs = this.ttlMs) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  /**
   * Fetch-through helper: returns the cached value if present, otherwise
   * calls `fn`, caches the result, and returns it. Concurrent callers with
   * the same key share the same in-flight promise.
   */
  async getOrSet(key, fn, ttlMs) {
    const cached = this.get(key);
    if (cached !== undefined) return cached;

    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }

    const promise = (async () => {
      try {
        const value = await fn();
        this.set(key, value, ttlMs);
        return value;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  clear() {
    this.store.clear();
  }
}

module.exports = new CacheService();
