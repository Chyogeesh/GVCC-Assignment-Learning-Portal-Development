import { Link } from 'react-router-dom'
import videos from '../data/videos.js'
import { useBookmarks } from '../context/BookmarkContext.jsx'
import { formatTime } from '../utils/time.js'

export default function ContinueWatching() {
  const { recent, getProgress } = useBookmarks()
  const items = recent.map((id) => videos.find((v) => v.id === id)).filter(Boolean)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Continue Watching</h1>
        <p className="text-slate-400 text-sm mt-1">Your recently watched videos, in order.</p>
      </div>

      {items.length === 0 ? (
        <p className="text-slate-500 text-sm">
          Nothing here yet —{' '}
          <Link to="/" className="text-brand-500 underline">
            browse the library
          </Link>{' '}
          to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((v) => {
            const p = getProgress(v.id)
            const pct = p?.duration ? Math.min(100, (p.currentTime / p.duration) * 100) : 0
            return (
              <Link
                key={v.id}
                to={`/video/${v.id}`}
                className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-3 hover:border-brand-600 transition"
              >
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-32 aspect-video object-cover rounded-lg shrink-0"
                  draggable={false}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{v.title}</h3>
                  <p className="text-sm text-slate-400">{v.instructor}</p>
                  <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatTime(p?.currentTime || 0)} / {formatTime(p?.duration || 0)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
