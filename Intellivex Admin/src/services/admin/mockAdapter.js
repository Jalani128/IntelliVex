import { DEFAULT_PER_PAGE } from './config'

const LATENCY_MS = 450

export const delay = (value, ms = LATENCY_MS) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms))

const notFound = () => Promise.reject({ message: 'Record not found', status: 404, errors: {} })

/**
 * In-memory stand-in for a Laravel resource controller.
 * Responses use Laravel's paginated shape so swapping to the real API
 * needs no UI changes: `{ data, meta: { current_page, per_page, total, last_page } }`.
 *
 * @param {object[]} seed          initial records (each with an `id`)
 * @param {object}   options
 * @param {string[]} options.searchFields  fields matched by `search`
 */
export function createMockResource(seed, { searchFields = ['name'] } = {}) {
  let records = structuredClone(seed)
  let nextId = Math.max(0, ...records.map((r) => Number(r.id) || 0)) + 1

  const find = (id) => records.find((r) => String(r.id) === String(id))

  return {
    list({ search = '', page = 1, per_page = DEFAULT_PER_PAGE, sort = '-created_at', ...filters } = {}) {
      const term = search.trim().toLowerCase()
      let rows = records.filter((r) => {
        const matchesSearch = !term || searchFields.some((f) => String(r[f] ?? '').toLowerCase().includes(term))
        const matchesFilters = Object.entries(filters).every(
          ([key, value]) => value === undefined || value === '' || value === 'all' || String(r[key]) === String(value),
        )
        return matchesSearch && matchesFilters
      })

      if (sort) {
        const desc = sort.startsWith('-')
        const key = desc ? sort.slice(1) : sort
        rows = [...rows].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * (desc ? -1 : 1))
      }

      const total = rows.length
      const last_page = Math.max(1, Math.ceil(total / per_page))
      const current_page = Math.min(Math.max(1, Number(page)), last_page)
      const start = (current_page - 1) * per_page

      return delay({
        data: rows.slice(start, start + per_page),
        meta: { current_page, per_page, total, last_page },
      })
    },

    get(id) {
      const record = find(id)
      return record ? delay({ data: record }) : notFound()
    },

    create(payload) {
      const now = new Date().toISOString()
      const record = { ...payload, id: nextId++, created_at: now, updated_at: now }
      records = [record, ...records]
      return delay({ data: record })
    },

    update(id, payload) {
      const record = find(id)
      if (!record) return notFound()
      Object.assign(record, payload, { updated_at: new Date().toISOString() })
      return delay({ data: record })
    },

    remove(id) {
      if (!find(id)) return notFound()
      records = records.filter((r) => String(r.id) !== String(id))
      return delay({ data: null })
    },

    setStatus(id, status) {
      return this.update(id, { status })
    },
  }
}
