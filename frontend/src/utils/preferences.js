// Browser storage can be blocked. Themes/layout should still work in that case.
export function readPreference(key, fallback) {
  try {
    return localStorage.getItem(`mern-base:${key}`) || fallback;
  } catch {
    return fallback;
  }
}
export function savePreference(key, value) {
  try {
    localStorage.setItem(`mern-base:${key}`, value);
  } catch { /* Preference remains in memory. */ }
}
