import axios from 'axios'
import { API_BASE_URL } from './config'

const TOKEN_KEY = 'iv-admin-token'

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

/** Fired on any 401 so the auth layer can sign the user out. */
export const UNAUTHORIZED_EVENT = 'iv-admin:unauthorized'

/**
 * "Remember me" keeps the token in localStorage; otherwise it lives in
 * sessionStorage and is gone when the browser closes.
 */
export const authToken = {
  get: () => localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY),
  set: (token, remember = false) => {
    authToken.clear()
    ;(remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token)
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  },
}

http.interceptors.request.use((config) => {
  const token = authToken.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/**
 * Normalise Laravel error responses into `{ message, status, errors }`,
 * where `errors` is the 422 validation bag (`{ field: [messages] }`).
 */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response
    if (res?.status === 401 && authToken.get()) {
      authToken.clear()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    return Promise.reject({
      message: res?.data?.message || error.message || 'Something went wrong',
      status: res?.status ?? 0,
      errors: res?.data?.errors ?? {},
    })
  },
)
