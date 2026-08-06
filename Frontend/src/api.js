// super simple helper to call our backend
const API_URL = "http://localhost:3000/api";

export async function apiRequest(path, method = "GET", body) {
  const res = await fetch(API_URL + path, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include", // so the login cookie gets sent
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}