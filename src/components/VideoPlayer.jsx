import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { formatTime } from '../utils/time.js'
import { useAuth } from '../context/AuthContext.jsx'

const VideoPlayer = forwardRef(function VideoPlayer(
  { video, startAt = 0, onTimeUpdate, onLoadedMeta },
  ref,
) {
  const { user } = useAuth()
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [shielded, setShielded] = useState(false)

  useImperativeHandle(ref, () => ({
    seekTo(seconds) {
      if (videoRef.current) {
        videoRef.current.currentTime = seconds
        videoRef.current.play().catch(() => {})
      }
    },
  }))

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const onLoaded = () => {
      setDuration(el.duration || 0)
      if (startAt > 0 && startAt < el.duration) el.currentTime = startAt
      onLoadedMeta?.(el.duration || 0)
    }
    const onTime = () => {
      setCurrent(el.currentTime)
      onTimeUpdate?.(el.currentTime, el.duration || 0)
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    el.addEventListener('loadedmetadata', onLoaded)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    return () => {
      el.removeEventListener('loadedmetadata', onLoaded)
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.id])

  // Pause + shield content when the tab is hidden/blurred - a common moment
  // for OS screenshot tools / screen recorders to be invoked.
  useEffect(() => {
    const handleVisibility = () => {
      const hidden = document.hidden
      setShielded(hidden)
      if (hidden && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('blur', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('blur', handleVisibility)
    }
  }, [])

  function togglePlay() {
    const el = videoRef.current
    if (!el) return
    if (el.paused) el.play()
    else el.pause()
  }

  function handleSeekBar(e) {
    const el = videoRef.current
    if (!el || !duration) return
    const pct = Number(e.target.value) / 100
    el.currentTime = pct * duration
  }

  const watermarkLabel = user ? `${user.name} · ${user.email}` : 'GVCC Learning Portal'

  return (
    <div className="protected-video-wrapper rounded-xl overflow-hidden bg-black border border-slate-800">
      <div className="relative">
        <video
          ref={videoRef}
          src={video.src}
          className="w-full aspect-video bg-black"
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          onClick={togglePlay}
        />

        {/* Per-viewer watermark - traceability if a capture leaks */}
        <div className="watermark-overlay no-select" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>{watermarkLabel}</span>
          ))}
        </div>

        {shielded && (
          <div className="privacy-shield no-select">
            <div className="px-6">
              <p className="text-lg font-semibold">Content hidden</p>
              <p className="text-sm text-slate-400 mt-1">
                Playback is paused while this tab is out of focus.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2 bg-slate-900">
        <input
          type="range"
          min={0}
          max={100}
          value={duration ? (current / duration) * 100 : 0}
          onChange={handleSeekBar}
          className="w-full accent-brand-500"
        />
        <div className="flex items-center justify-between text-sm text-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-9 h-9 grid place-items-center rounded-full bg-brand-600 hover:bg-brand-700 transition"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? '❚❚' : '►'}
            </button>
            <span className="tabular-nums text-slate-400">
              {formatTime(current)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default VideoPlayer
