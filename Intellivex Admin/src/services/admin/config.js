/** Single switch between in-memory mocks and the Laravel API. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/admin'

export const DEFAULT_PER_PAGE = 10
