import { http } from './http'
import { USE_MOCK } from './config'
import { createMockResource, queryRecords } from './mockAdapter'
import { inquiriesMock } from '@/mock/admin/inquiries.mock'

/**
 * Contact-form submissions — CONTACT_INQUIRIES_API.md:
 *   GET    /contact-inquiries        → { data: [...] }   all rows, newest first, no pagination / filters
 *   GET    /contact-inquiries/{id}   → { data }
 *   PATCH  /contact-inquiries/{id}   { status?, is_read? } → { data, message }
 *   DELETE /contact-inquiries/{id}   → 204
 *
 * The API returns the whole list, so search / filter / pagination happen here.
 */
const ENDPOINT = '/contact-inquiries'
const SEARCH_FIELDS = ['full_name', 'email', 'phone', 'subject']

const mock = createMockResource(inquiriesMock, { searchFields: SEARCH_FIELDS })

const source = USE_MOCK
  ? {
      all: () => mock.list({ per_page: 10_000, sort: '-received_at' }).then((r) => r.data),
      get: (id) => mock.get(id),
      update: (id, patch) => mock.update(id, patch),
      remove: (id) => mock.remove(id).then(() => null),
    }
  : {
      all: () => http.get(ENDPOINT).then((r) => r.data.data),
      get: (id) => http.get(`${ENDPOINT}/${id}`).then((r) => r.data),
      update: (id, patch) => http.patch(`${ENDPOINT}/${id}`, patch).then((r) => r.data),
      remove: (id) => http.delete(`${ENDPOINT}/${id}`).then(() => null),
    }

/** Search / filter / sort / paginate a loaded list → `{ data, meta }`. */
export const queryInquiries = (rows, params = {}) =>
  queryRecords(rows, { sort: '-received_at', ...params }, { searchFields: SEARCH_FIELDS })

export const inquiriesApi = {
  /** Every inquiry, newest first. */
  all: source.all,
  /** `all()` + local query → `{ data, meta }` — for the dashboard widgets and the bell menu. */
  list: (params) => source.all().then((rows) => queryInquiries(rows, params)),
  get: source.get,
  /** PATCH `{ status }` and / or `{ is_read }` → `{ data }` with the updated row. */
  update: source.update,
  setStatus: (id, status) => source.update(id, { status }),
  markRead: (id) => source.update(id, { is_read: true }),
  remove: source.remove,
}

export const INQUIRY_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]
