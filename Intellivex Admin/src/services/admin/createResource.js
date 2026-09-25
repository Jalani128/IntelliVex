import { http } from './http'
import { USE_MOCK } from './config'
import { createMockResource } from './mockAdapter'

/**
 * Build a CRUD client for one admin resource.
 *
 * Laravel side (expected):
 *   GET    /{endpoint}?search=&page=&per_page=&status=…   → { data, meta }
 *   GET    /{endpoint}/{id}                               → { data }
 *   POST   /{endpoint}                                    → { data }
 *   PUT    /{endpoint}/{id}                               → { data }
 *   DELETE /{endpoint}/{id}
 *   PATCH  /{endpoint}/{id}/status  { status }            → { data }
 *
 * While `VITE_USE_MOCK` is on, the same calls are served from `mock`.
 */
export function createResource(endpoint, { seed = [], searchFields } = {}) {
  if (USE_MOCK) return createMockResource(seed, { searchFields })

  return {
    list: (params) => http.get(`/${endpoint}`, { params }).then((r) => r.data),
    get: (id) => http.get(`/${endpoint}/${id}`).then((r) => r.data),
    create: (payload) => http.post(`/${endpoint}`, payload).then((r) => r.data),
    update: (id, payload) => http.put(`/${endpoint}/${id}`, payload).then((r) => r.data),
    remove: (id) => http.delete(`/${endpoint}/${id}`).then((r) => r.data),
    setStatus: (id, status) => http.patch(`/${endpoint}/${id}/status`, { status }).then((r) => r.data),
  }
}
