import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) return setLoading(false)
    api.get('/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => sessionStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { user, token } = await api.post('/auth/login', { email, password })
    sessionStorage.setItem('token', token)
    setUser(user)
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { user, token } = await api.post('/auth/register', { name, email, password })
    sessionStorage.setItem('token', token)
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
