import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ScreenshotProtection from './components/ScreenshotProtection.jsx'
import Home from './pages/Home.jsx'
import VideoPage from './pages/VideoPage.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ContinueWatching from './pages/ContinueWatching.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScreenshotProtection />
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/continue-watching" element={<ContinueWatching />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-slate-500 py-6 no-select">
        GVCC Learning Portal · Built for the GVCC Assignment
      </footer>
    </div>
  )
}
