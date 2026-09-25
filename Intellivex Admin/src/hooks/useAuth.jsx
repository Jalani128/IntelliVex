import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '@/services/admin/auth'
import { UNAUTHORIZED_EVENT } from '@/services/admin/http'

const AuthContext = createContext(null)

/**
 * Holds the signed-in admin. `status` is:
 *   'loading'        – checking a stored token on first load
 *   'authenticated'  – `user` is set
 *   'guest'          – no valid session
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    authApi
      .me()
      .then((u) => !cancelled && (setUser(u), setStatus('authenticated')))
      .catch(() => !cancelled && (setUser(null), setStatus('guest')))

    const onUnauthorized = () => {
      setUser(null)
      setStatus('guest')
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => {
      cancelled = true
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const u = await authApi.login(credentials)
    setUser(u)
    setStatus('authenticated')
    return u
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setStatus('guest')
  }, [])

  const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
