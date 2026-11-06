/**
 * Mock admin accounts — used only while VITE_USE_MOCK_AUTH is not 'false'.
 * Real credentials are checked by Laravel; never ship real passwords in the frontend.
 * The check reads import.meta.env directly so the build replaces it with a constant
 * and drops the list (and its password) from real-login bundles.
 */
export const adminAccountsMock = import.meta.env.VITE_USE_MOCK_AUTH === 'false' ? [] : [
  {
    id: 1,
    username: 'Jilani',
    password: 'admin123',
    name: 'Jilani',
    email: 'admin@intellivex.com',
    role: 'Super Admin',
    avatar: null,
  },
]
