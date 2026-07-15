export function formatTime(totalSeconds = 0) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const hrs = Math.floor(s / 3600)
  const mins = Math.floor((s % 3600) / 60)
  const secs = s % 60

  const mm = hrs > 0 ? String(mins).padStart(2, '0') : String(mins)
  const ss = String(secs).padStart(2, '0')

  return hrs > 0 ? `${hrs}:${mm}:${ss}` : `${mm}:${ss}`
}

// Parses "mm:ss" or "hh:mm:ss" back into seconds, used for manual timestamp entry.
export function parseTime(str) {
  const parts = String(str).split(':').map((p) => parseInt(p, 10))
  if (parts.some(Number.isNaN)) return null
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return null
}
