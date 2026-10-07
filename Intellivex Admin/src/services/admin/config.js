/** Single switch between in-memory mocks and the Laravel API. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

/**
 * Login stays on mock accounts until the Laravel API has an auth system
 * (CONTACT_INQUIRIES_API.md: "The application does not currently have an API
 * authentication system"). Set VITE_USE_MOCK_AUTH=false once /login and /me exist.
 */
export const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH !== 'false'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/admin'

export const DEFAULT_PER_PAGE = 10

/** Public website origin, for "View on website" links (no trailing slash). */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '')
