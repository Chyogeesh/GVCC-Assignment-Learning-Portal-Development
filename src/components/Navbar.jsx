import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-8 h-8 rounded-lg bg-brand-600 grid place-items-center text-white">G</span>
          GVCC Learning Portal
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-brand-500 transition">
            Courses
          </Link>
          <Link to="/continue-watching" className="hover:text-brand-500 transition">
            Continue Watching
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-400 hidden sm:inline">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition">
                Log in
              </Link>
              <Link to="/signup" className="px-3 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 transition">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
