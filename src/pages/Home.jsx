import { useMemo, useState } from 'react'
import videos from '../data/videos.js'
import VideoCard from '../components/VideoCard.jsx'

export default function Home() {
  const [query, setQuery] = useState('')
  const categories = useMemo(() => ['All', ...new Set(videos.map((v) => v.category))], [])
  const [category, setCategory] = useState('All')

  const filtered = videos.filter((v) => {
    const matchesQuery = (v.title + v.instructor).toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All' || v.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Course Library</h1>
        <p className="text-slate-400 text-sm mt-1">Pick up where you left off, or start something new.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos or instructors..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500 text-sm">No videos match your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  )
}
