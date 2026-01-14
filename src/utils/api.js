const rawBase =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

/**
 * Normalize base URL
 * - removes trailing slash
 * - prevents double slashes in fetch calls
 */
export const API_BASE = rawBase.replace(/\/$/, "");

/**
 * Dev-time sanity check
 * (won’t break prod, but helps catch env mistakes early)
 */
if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE) {
  console.warn(
    "⚠️ VITE_API_BASE is not defined. Falling back to http://localhost:5000"
  );
}
