import { useState } from 'react'
import { formatTime } from '../utils/time.js'

export default function BookmarkForm({ currentTime, onAdd }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onAdd({ name, timestamp: currentTime })
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Bookmark name (optional)"
        className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
      <span className="text-sm text-slate-400 whitespace-nowrap px-1">
        at <span className="font-mono text-slate-200">{formatTime(currentTime)}</span>
      </span>
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 transition text-sm font-medium whitespace-nowrap"
      >
        + Add bookmark
      </button>
    </form>
  )
}
