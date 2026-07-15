// Thin, safe wrapper around localStorage so the rest of the app never has to
// worry about JSON parsing, SSR, or quota errors.

const NS = 'gvcc-portal:'

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable (private mode) - fail silently, app still works in-memory.
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(NS + key)
  } catch {
    /* no-op */
  }
}
