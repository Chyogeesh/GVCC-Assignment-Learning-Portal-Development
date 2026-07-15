import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const res = signup(form)
    if (!res.ok) setError(res.error)
    else navigate('/')
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Create an account</h1>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <input
          type="password"
          required
          minLength={4}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <button type="submit" className="mt-2 bg-brand-600 hover:bg-brand-700 transition rounded-md py-2 text-sm font-medium">
          Sign up
        </button>
      </form>
      <p className="text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-500 underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
