import { createContext, useContext, useState } from 'react'
import { currentUser as mockCurrentUser } from '../data/students.js'

const AuthContext = createContext(null)

// NOTE: This is a frontend-only mock. Replace `login`/`logout` with real
// calls into services/api.js once the backend is connected.
export function AuthProvider({ children }) {
  // Default to "logged in" as the demo user so every screen is explorable.
  const [user, setUser] = useState(mockCurrentUser)

  const login = (credentials) => {
    setUser(mockCurrentUser)
    return Promise.resolve(mockCurrentUser)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
