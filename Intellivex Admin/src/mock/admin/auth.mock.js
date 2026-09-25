/**
 * Mock admin accounts — used only while VITE_USE_MOCK=true.
 * Real credentials are checked by Laravel; never ship real passwords in the frontend.
 */
export const adminAccountsMock = [
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
