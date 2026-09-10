# Reel — Movie Discovery App

A full-stack movie discovery app built with **React + Node.js**, backed by **The Movie Database (TMDB)** API.

Browse trending and popular movies, filter by genre/year, sort results, search by title, open a movie for full details (cast, trailer, similar titles), and save movies to a wishlist that persists across sessions.

---

## Setup

### Prerequisites
- Node.js 18+
- A free TMDB API key: register at https://www.themoviedb.org/settings/api

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and paste your TMDB_API_KEY
npm run dev        # http://localhost:5000
```

The SQLite database file is created automatically on first run (`backend/data/wishlist.db`) — no manual migration step needed.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults already point at http://localhost:5000/api
npm run dev             # http://localhost:5173
```

Open http://localhost:5173. The frontend talks only to the local backend — never directly to TMDB.

---

## Approach

The brief asked for a product, not an API demo, so the priority order was:
1. A browsing experience that gives you something to look at immediately (trending strip + popular grid on load, no search required).
2. A backend that genuinely earns its place as an abstraction layer — caching, retries, and data shaping — rather than a thin proxy.
3. A wishlist that survives closing the app, without forcing the reviewer to set up authentication just to test it.
4. Visible, honest feedback for loading / empty / error states, since the brief calls these out explicitly.

---

## Architecture

```
frontend (React/Vite)  →  backend (Express)  →  TMDB API
                              ↓
                        SQLite (wishlist only)
```

- **Frontend never calls TMDB directly.** Every movie read goes through the Node backend, which is the only thing that holds the TMDB key.
- **The backend is the seam for resilience.** Caching, retry/backoff, and timeouts all live in `backend/src/services/tmdbService.js` — the rest of the app just calls plain async functions and doesn't know TMDB exists underneath.
- **Only the wishlist is persisted in our own database.** Movie data (titles, posters, ratings, cast, etc.) is never duplicated into SQLite — TMDB remains the source of truth and we cache reads in memory instead. This avoids the app's copy of movie data going stale and avoids modeling a huge, TMDB-shaped schema for data we don't own.

## Important Technical Decisions

**Caching & de-duplication (`cacheService.js`)**
In-memory TTL cache, keyed by endpoint + query params. Genres are cached for 24h (they never change), movie details for 30 minutes, discover/search results for a few minutes. Concurrent identical requests (e.g. React StrictMode's double-invoke, or a user clicking twice) share a single in-flight promise instead of firing two TMDB calls. This directly addresses "the same information is requested repeatedly."

**Resilience against TMDB being slow/unavailable (`tmdbService.js`)**
Every TMDB call has an 8s timeout and retries (with backoff) on `429` (respecting `Retry-After`) and transient `5xx`/timeout errors, up to 2 attempts, before surfacing a clean error to the client. This means a flaky upstream response doesn't automatically become a flaky user experience.

**Handling rapid filter/search changes**
The frontend cancels the previous in-flight request via `AbortController` whenever the user changes a filter or types a new search query, and tags each request with an incrementing id so a slow, stale response can never overwrite a newer one. This solves the classic "fast typer sees results flicker to an old query" bug.

**Large result sets**
Results are paginated at the TMDB layer (20/page) and the frontend loads more via infinite scroll (`IntersectionObserver`), rendering only what's been fetched — no attempt to load "all" results into memory or the DOM at once. TMDB's own 500-page cap is respected server-side.

**Wishlist persistence & identity**
No login system — out of scope for this exercise — but the wishlist still needs to survive reloads and be scoped per user. The frontend generates a UUID on first load, stores it in `localStorage`, and sends it as `X-User-Id` on every request. The backend uses that as the SQLite partition key. It's a deliberately lightweight stand-in: swapping in real auth later just means replacing where `req.userId` comes from — no other code changes.

**Optimistic wishlist updates**
Adding/removing a movie updates the UI immediately and rolls back if the backend call fails, so the interaction feels instant without lying to the user when something actually goes wrong.

**Data shaping (`transformMovie.js`)**
TMDB's raw response format (relative image paths, mixed nesting, inconsistent nullability) is normalized into one flat shape the frontend can rely on — full poster/backdrop URLs, a consistent `releaseYear`, resolved genre names instead of just ids, etc. The client is never aware of TMDB's response conventions.

**Rate limiting our own API**
`express-rate-limit` caps each client to 120 requests/minute against our API, independent of TMDB's own limits — protects the backend (and by extension the shared TMDB quota) from a runaway client.

## Assumptions Made
- No user accounts/authentication were required by the brief; the wishlist is scoped by a generated device/browser identity instead.
- Adult content is filtered out of discover/search results.
- "Top rated" sort applies a minimum vote count threshold (50) to avoid a movie with one 10/10 vote outranking well-established films.
- A single TMDB API key (server-side) is sufficient — no per-user TMDB accounts.

## Known Limitations
- The wishlist identity lives in `localStorage`, so it doesn't follow a user across browsers/devices, and clearing site data resets it. Real auth would fix this.
- The in-memory cache resets on server restart and doesn't share state across multiple backend instances — fine for this exercise, but a horizontally-scaled deployment would want Redis instead (the cache is already isolated behind one small module, so that's a contained swap).
- No automated test suite included given the time box; manual testing covered the flows described above.
- Trailer playback links out to YouTube rather than an embedded player.

## What I'd Improve With More Time
- Automated tests: backend integration tests for the TMDB service (mocked) and controllers; frontend component/interaction tests.
- Redis-backed cache and a proper job/queue for cache warming of popular queries.
- Real authentication so wishlists follow a person across devices.
- Keyboard navigation polish and a fuller accessibility audit (ARIA live regions for async loading states, focus management on route change).
- A "watched" state alongside the wishlist, and basic recommendations based on wishlist contents.

## AI Tools Used
Used AI (Claude) to scaffold the initial project structure, generate boilerplate for the Express routes/controllers and React components, and help troubleshoot TMDB's response shapes and pagination limits. The architecture decisions — the caching/retry strategy, the choice to persist only the wishlist and treat TMDB as the source of truth for everything else, the client-identity approach to wishlist scoping, and the error-handling model — were made deliberately as described above, and I can walk through, modify, or extend any part of this implementation.

---

## Project Structure

```
movie-discovery-app/
├── backend/
│   └── src/
│       ├── config/       # env, db setup
│       ├── controllers/  # request handlers
│       ├── middleware/   # error handling, rate limiting, user identity
│       ├── routes/
│       ├── services/     # tmdbService (external API), cacheService
│       └── utils/        # AppError, asyncHandler, data transforms
└── frontend/
    └── src/
        ├── api/          # fetch wrappers for backend endpoints
        ├── components/   # MovieCard, FilterBar, Navbar, states, etc.
        ├── context/       # WishlistContext (global state)
        ├── hooks/        # useDebounce, useInfiniteScroll
        ├── pages/        # Discover, Search, MovieDetails, Wishlist
        └── styles/
```
