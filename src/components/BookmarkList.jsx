import { useState } from 'react'
import { formatTime } from '../utils/time.js'

export default function BookmarkList({ bookmarks, onJump, onDelete, onRename }) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')

  if (bookmarks.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">
        No bookmarks yet. Play the video and hit "Add bookmark" to save a spot.
      </p>
    )
  }

  function startEdit(b) {
    setEditingId(b.id)
    setDraft(b.name)
  }

  function commitEdit(id) {
    if (draft.trim()) onRename(id, draft.trim())
    setEditingId(null)
  }

  return (
    <ul className="flex flex-col gap-2">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2"
        >
          <button
            onClick={() => onJump(b.timestamp)}
            className="flex items-center gap-3 flex-1 min-w-0 text-left group"
            title="Jump to this timestamp"
          >
            <span className="font-mono text-xs bg-brand-600/20 text-brand-400 rounded px-2 py-1 shrink-0">
              {formatTime(b.timestamp)}
            </span>
            {editingId === b.id ? (
              <input
                autoFocus
                value={draft}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => commitEdit(b.id)}
                onKeyDown={(e) => e.key === 'Enter' && commitEdit(b.id)}
                className="bg-slate-800 border border-brand-500 rounded px-2 py-1 text-sm flex-1 min-w-0"
              />
            ) : (
              <span className="truncate group-hover:text-brand-400 transition">{b.name}</span>
            )}
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => startEdit(b)}
              className="w-7 h-7 grid place-items-center rounded hover:bg-slate-800 text-slate-400"
              title="Rename"
            >
              ✎
            </button>
            <button
              onClick={() => onDelete(b.id)}
              className="w-7 h-7 grid place-items-center rounded hover:bg-red-950 text-red-400"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
