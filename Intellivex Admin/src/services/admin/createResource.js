import { http } from './http'
import { USE_MOCK } from './config'
import { createMockResource, delay } from './mockAdapter'

// The shared client defaults to JSON, which would make axios serialise FormData back to JSON.
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } }

/** Laravel rejects `per_page` above this with a 422 ("must not be greater than 100"). */
const MAX_PER_PAGE = 100

/**
 * Drop "no filter" values before they reach Laravel: list pages use `'all'` for
 * "any", and `status=all` or `is_featured=all` would fail the API's enum / boolean rules.
 * `per_page` is capped at the API maximum (lookup lists ask for "everything").
 */
const cleanParams = (params = {}) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== 'all'),
  )
  if (cleaned.per_page > MAX_PER_PAGE) cleaned.per_page = MAX_PER_PAGE
  return cleaned
}

/** True when a File sits anywhere in the payload — including arrays like `gallery[].image`. */
const hasFile = (value) =>
  value instanceof Blob || (value !== null && typeof value === 'object' && Object.values(value).some(hasFile))

/**
 * Flatten a payload into multipart form-data the way Laravel reads it:
 * arrays → `key[0]`, nested objects → `key[0][field]`, booleans → 1 / 0.
 */
function toFormData(payload, form = new FormData(), prefix = '') {
  Object.entries(payload).forEach(([key, value]) => {
    const name = prefix ? `${prefix}[${key}]` : key
    if (value === undefined) return
    if (value instanceof Blob) form.append(name, value)
    else if (value === null) form.append(name, '')
    else if (typeof value === 'boolean') form.append(name, value ? '1' : '0')
    else if (typeof value === 'object') toFormData(value, form, name)
    else form.append(name, value)
  })
  return form
}

/** Mock stand-in for file storage: File → `{field}_url` blob URL, `remove_{field}` or `{field}: null` → null. */
function storeMockUploads(payload, imageFields) {
  const next = { ...payload }
  imageFields.forEach((field) => {
    if (next[field] instanceof Blob) next[`${field}_url`] = URL.createObjectURL(next[field])
    if (next[`remove_${field}`] || next[field] === null) next[`${field}_url`] = null
    delete next[field]
    delete next[`remove_${field}`]
  })
  return next
}

/**
 * Mock stand-in for gallery lists (`gallery: [{ id?, image?, alt }]`): new files become
 * blob URLs with a fresh id, kept items keep their stored `image_url` by id.
 */
let nextGalleryId = 1000
function storeMockGalleries(payload, galleryFields, previous = {}) {
  const next = { ...payload }
  galleryFields.forEach((field) => {
    if (!next[field]) return
    next[field] = next[field].map(({ image, ...item }) => ({
      ...item,
      id: item.id ?? nextGalleryId++,
      image_url: image instanceof Blob ? URL.createObjectURL(image) : previous[field]?.find((p) => p.id === item.id)?.image_url,
    }))
  })
  return next
}

function withMockUploads(resource, imageFields, galleryFields) {
  if (!imageFields.length && !galleryFields.length) return resource
  const store = (payload, previous) => storeMockGalleries(storeMockUploads(payload, imageFields), galleryFields, previous)
  return {
    ...resource,
    create: (payload) => resource.create(store(payload)),
    update: async (id, payload) => {
      const previous = galleryFields.length ? (await resource.get(id)).data : undefined
      return resource.update(id, store(payload, previous))
    },
    setStatus: (id, status) => resource.update(id, { status }),
  }
}

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
 * Payloads carrying a File go out as multipart; updates then use
 * POST + `_method=PUT`, since PHP only parses multipart bodies on POST.
 *
 * While `VITE_USE_MOCK` is on, the same calls are served from `mock`.
 * `imageFields` names upload fields that come back as `{field}_url`, and
 * `galleryFields` image lists that come back as `[{ id, image_url, alt }]`; the
 * mock turns uploads into blob URLs so previews survive a save.
 */
export function createResource(endpoint, { seed = [], searchFields, imageFields = [], galleryFields = [] } = {}) {
  if (USE_MOCK) return withMockUploads(createMockResource(seed, { searchFields }), imageFields, galleryFields)

  return {
    list: (params) => http.get(`/${endpoint}`, { params: cleanParams(params) }).then((r) => r.data),
    get: (id) => http.get(`/${endpoint}/${id}`).then((r) => r.data),
    create: (payload) =>
      (hasFile(payload) ? http.post(`/${endpoint}`, toFormData(payload), MULTIPART) : http.post(`/${endpoint}`, payload)).then((r) => r.data),
    update: (id, payload) =>
      (hasFile(payload)
        ? http.post(`/${endpoint}/${id}`, toFormData({ ...payload, _method: 'PUT' }), MULTIPART)
        : http.put(`/${endpoint}/${id}`, payload)
      ).then((r) => r.data),
    remove: (id) => http.delete(`/${endpoint}/${id}`).then((r) => r.data),
    setStatus: (id, status) => http.patch(`/${endpoint}/${id}/status`, { status }).then((r) => r.data),
  }
}

/**
 * Client for a single-record endpoint (page content that always has exactly one row):
 *   GET /{endpoint}  → { data }
 *   PUT /{endpoint}  → { data }   (multipart via POST + `_method=PUT` when a File is attached)
 */
export function createSingleton(endpoint, { seed = {}, imageFields = [] } = {}) {
  if (USE_MOCK) {
    let record = structuredClone(seed)
    return {
      get: () => delay({ data: record }),
      update: (payload) => {
        record = { ...record, ...storeMockUploads(payload, imageFields), updated_at: new Date().toISOString() }
        return delay({ data: record })
      },
    }
  }

  return {
    get: () => http.get(`/${endpoint}`).then((r) => r.data),
    update: (payload) =>
      (hasFile(payload)
        ? http.post(`/${endpoint}`, toFormData({ ...payload, _method: 'PUT' }), MULTIPART)
        : http.put(`/${endpoint}`, payload)
      ).then((r) => r.data),
  }
}
