import { createContext, useContext, useEffect, useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'
import { useAuth } from './AuthContext'

const BookmarkContext = createContext(null)

// Bookmarks / progress are namespaced per-user (falls back to "guest") so
// switching accounts on the same browser doesn't mix data.

export function BookmarkProvider({ children }) {
  const { user } = useAuth()
  const scope = user?.id || 'guest'

  const [bookmarks, setBookmarks] = useState(() => readJSON(`bookmarks:${scope}`, {}))
  const [progress, setProgress] = useState(() => readJSON(`progress:${scope}`, {}))
  const [recent, setRecent] = useState(() => readJSON(`recent:${scope}`, []))

  // Reload when the active user changes.
  useEffect(() => {
    setBookmarks(readJSON(`bookmarks:${scope}`, {}))
    setProgress(readJSON(`progress:${scope}`, {}))
    setRecent(readJSON(`recent:${scope}`, []))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope])

  useEffect(() => writeJSON(`bookmarks:${scope}`, bookmarks), [bookmarks, scope])
  useEffect(() => writeJSON(`progress:${scope}`, progress), [progress, scope])
  useEffect(() => writeJSON(`recent:${scope}`, recent), [recent, scope])

  function addBookmark(videoId, { name, timestamp }) {
    setBookmarks((prev) => {
      const list = prev[videoId] || []
      const entry = {
        id: crypto.randomUUID(),
        videoId,
        name: name?.trim() || `Bookmark at ${formatShort(timestamp)}`,
        timestamp,
        createdAt: Date.now(),
      }
      const updated = [...list, entry].sort((a, b) => a.timestamp - b.timestamp)
      return { ...prev, [videoId]: updated }
    })
  }

  function updateBookmark(videoId, bookmarkId, changes) {
    setBookmarks((prev) => {
      const list = (prev[videoId] || []).map((b) =>
        b.id === bookmarkId ? { ...b, ...changes } : b,
      )
      list.sort((a, b) => a.timestamp - b.timestamp)
      return { ...prev, [videoId]: list }
    })
  }

  function deleteBookmark(videoId, bookmarkId) {
    setBookmarks((prev) => ({
      ...prev,
      [videoId]: (prev[videoId] || []).filter((b) => b.id !== bookmarkId),
    }))
  }

  function getBookmarks(videoId) {
    return bookmarks[videoId] || []
  }

  function saveProgress(videoId, currentTime, duration) {
    setProgress((prev) => ({
      ...prev,
      [videoId]: { currentTime, duration, updatedAt: Date.now() },
    }))
    setRecent((prev) => {
      const withoutCurrent = prev.filter((id) => id !== videoId)
      return [videoId, ...withoutCurrent].slice(0, 8)
    })
  }

  function getProgress(videoId) {
    return progress[videoId] || null
  }

  return (
    <BookmarkContext.Provider
      value={{
        addBookmark,
        updateBookmark,
        deleteBookmark,
        getBookmarks,
        saveProgress,
        getProgress,
        recent,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  )
}

function formatShort(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext)
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider')
  return ctx
}
