import { http, authToken } from './http'
import { USE_MOCK } from './config'
import { delay } from './mockAdapter'
import { adminAccountsMock } from '@/mock/admin/auth.mock'

const MOCK_TOKEN_PREFIX = 'mock-token-'

const publicUser = ({ password, ...user }) => user

const mockAuth = {
  login({ username, password }) {
    const account = adminAccountsMock.find(
      (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password,
    )
    if (!account) {
      return delay(null, 600).then(() =>
        Promise.reject({ status: 422, message: 'Invalid username or password.', errors: {} }),
      )
    }
    return delay({ data: { token: `${MOCK_TOKEN_PREFIX}${account.id}`, user: publicUser(account) } }, 600)
  },
  me() {
    const id = authToken.get()?.replace(MOCK_TOKEN_PREFIX, '')
    const account = adminAccountsMock.find((a) => String(a.id) === id)
    return account
      ? delay({ data: publicUser(account) }, 200)
      : Promise.reject({ status: 401, message: 'Unauthenticated.', errors: {} })
  },
  logout: () => delay(null, 150),
}

/**
 * Expected Laravel routes (Sanctum personal access tokens):
 *   POST /login   { username, password, remember }  → { data: { token, user } }   422 on bad credentials
 *   GET  /me                                        → { data: user }              401 when the token is invalid
 *   POST /logout
 */
export const authApi = {
  async login({ username, password, remember = false }) {
    const res = USE_MOCK
      ? await mockAuth.login({ username, password })
      : await http.post('/login', { username, password, remember }).then((r) => r.data)
    authToken.set(res.data.token, remember)
    return res.data.user
  },

  async me() {
    if (!authToken.get()) throw { status: 401, message: 'Unauthenticated.', errors: {} }
    const res = USE_MOCK ? await mockAuth.me() : await http.get('/me').then((r) => r.data)
    return res.data
  },

  async logout() {
    try {
      await (USE_MOCK ? mockAuth.logout() : http.post('/logout'))
    } finally {
      authToken.clear()
    }
  },
}
