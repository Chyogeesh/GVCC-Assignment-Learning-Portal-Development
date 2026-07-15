import { useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import videos from '../data/videos.js'
import VideoPlayer from '../components/VideoPlayer.jsx'
import BookmarkForm from '../components/BookmarkForm.jsx'
import BookmarkList from '../components/BookmarkList.jsx'
import { useBookmarks } from '../context/BookmarkContext.jsx'

export default function VideoPage() {
  const { id } = useParams()
  const video = useMemo(() => videos.find((v) => v.id === id), [id])
  const { addBookmark, updateBookmark, deleteBookmark, getBookmarks, saveProgress, getProgress } =
    useBookmarks()

  const playerRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const lastSaveRef = useRef(0)

  if (!video) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Video not found.</p>
        <Link to="/" className="text-brand-500 underline">
          Back to library
        </Link>
      </div>
    )
  }

  const bookmarks = getBookmarks(video.id)
  const resumeAt = getProgress(video.id)?.currentTime || 0

  function handleTimeUpdate(time, duration) {
    setCurrentTime(time)
    if (time - lastSaveRef.current > 2) {
      lastSaveRef.current = time
      saveProgress(video.id, time, duration)
    }
  }

  function handleAddBookmark({ name, timestamp }) {
    addBookmark(video.id, { name, timestamp })
  }

  function handleJump(timestamp) {
    playerRef.current?.seekTo(timestamp)
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6">
      <div className="flex flex-col gap-4 min-w-0">
        <VideoPlayer
          ref={playerRef}
          video={video}
          startAt={resumeAt}
          onTimeUpdate={handleTimeUpdate}
        />
        <div>
          <h1 className="text-xl font-bold">{video.title}</h1>
          <p className="text-sm text-slate-400 mt-1">
            {video.instructor} · {video.category}
          </p>
          <p className="text-sm text-slate-300 mt-3">{video.description}</p>
        </div>
      </div>

      <aside className="flex flex-col gap-4 min-w-0">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-400">
            Add a bookmark
          </h2>
          <BookmarkForm currentTime={currentTime} onAdd={handleAddBookmark} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-400">
            Your bookmarks ({bookmarks.length})
          </h2>
          <BookmarkList
            bookmarks={bookmarks}
            onJump={handleJump}
            onDelete={(bookmarkId) => deleteBookmark(video.id, bookmarkId)}
            onRename={(bookmarkId, name) => updateBookmark(video.id, bookmarkId, { name })}
          />
        </div>
      </aside>
    </div>
  )
}
