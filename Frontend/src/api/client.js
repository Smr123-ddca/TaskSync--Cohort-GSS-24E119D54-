const BASE_URL = 'http://localhost:3000/api';

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include', // sends the auth cookie
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  // DELETE/logout-style endpoints may return an empty 204 body.
  if (res.status === 204) {
    return null;
  }

  return res.json();
}