const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USER_ID_KEY = 'reel_user_id';

function getOrCreateUserId() {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export const userId = getOrCreateUserId();

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/**
 * Thin fetch wrapper: attaches the client identity header, normalizes
 * backend error shapes into ApiError, and lets callers pass an
 * AbortSignal so in-flight requests can be cancelled when the user
 * types a new search query or navigates away mid-request.
 */
export async function apiFetch(path, { signal, ...options } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      signal,
      ...options,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Could not connect to the server. Check your connection and try again.', 0, 'NETWORK_ERROR');
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    // no JSON body — fine for e.g. 204s
  }

  if (!response.ok) {
    const message = body?.error?.message || 'Something went wrong.';
    const code = body?.error?.code || 'UNKNOWN_ERROR';
    throw new ApiError(message, response.status, code);
  }

  return body;
}
