import { Link } from 'react-router-dom'
import { useBookmarks } from '../context/BookmarkContext.jsx'

export default function VideoCard({ video }) {
  const { getProgress } = useBookmarks()
  const progress = getProgress(video.id)
  const pct = progress?.duration ? Math.min(100, (progress.currentTime / progress.duration) * 100) : 0

  return (
    <Link
      to={`/video/${video.id}`}
      className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-brand-600 transition flex flex-col"
    >
      <div className="relative aspect-video bg-slate-800 overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          draggable={false}
        />
        <span className="absolute bottom-2 right-2 text-xs bg-black/70 px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
        {pct > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-brand-500">{video.category}</span>
        <h3 className="font-semibold leading-snug group-hover:text-brand-400 transition">{video.title}</h3>
        <p className="text-sm text-slate-400 mt-auto">{video.instructor}</p>
      </div>
    </Link>
  )
}
