export const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("admin_token");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  return res.json();
}
