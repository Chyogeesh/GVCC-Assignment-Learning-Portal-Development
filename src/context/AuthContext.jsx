import { createContext, useContext, useEffect, useState } from 'react'
import { readJSON, writeJSON, removeKey } from '../utils/storage'

const AuthContext = createContext(null)

// NOTE: This is a client-only demo auth system (localStorage-based) so the
// portal can run as a static site on Vercel with zero backend. Swap this out
// for a real API (JWT/session cookies) for production use.

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON('session', null))

  useEffect(() => {
    if (user) writeJSON('session', user)
    else removeKey('session')
  }, [user])

  function signup({ name, email, password }) {
    const users = readJSON('users', [])
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const newUser = { id: crypto.randomUUID(), name, email, password }
    writeJSON('users', [...users, newUser])
    setUser({ id: newUser.id, name, email })
    return { ok: true }
  }

  function login({ email, password }) {
    const users = readJSON('users', [])
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) return { ok: false, error: 'Invalid email or password.' }
    setUser({ id: found.id, name: found.name, email: found.email })
    return { ok: true }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
