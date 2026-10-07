import { inquiriesApi } from './inquiries'
import { projectsApi } from './projects'
import { servicesApi, serviceName } from './services'
import { industriesApi, industryName } from './industries'
import { productsApi } from './products'
import { reviewsApi, clientsApi, successStoriesApi } from './testimonials'
import { partnersApi } from './partnerships'
import { teamMembersApi } from './team'

/**
 * The dashboard has no endpoints of its own — every number is worked out here from
 * the module APIs the admin already uses (same calls in mock and live mode):
 *   stats          /contact-inquiries + published /projects, /services, /testimonials
 *   inquiry trend  /contact-inquiries, bucketed by `received_at`
 *   by industry    /industries/{id} → `project_ids`
 *   recent changes `created_at` / `updated_at` across the content modules
 *   sections       one summary per sidebar section, from the same rows
 */

export const RANGE_DAYS = { '7d': 7, '30d': 30, '90d': 90 }
const DAY = 86_400_000
const PAGE = 100 // API maximum per_page

/** Every row of a paginated resource (all pages). */
async function fetchAll(api, params = {}) {
  const first = await api.list({ ...params, page: 1, per_page: PAGE })
  const pages = Math.min(first.meta?.last_page ?? 1, 20)
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => api.list({ ...params, page: i + 2, per_page: PAGE })))
  return [first, ...rest].flatMap((r) => r.data ?? [])
}

/** Content modules in "Recent changes": where they're edited and what a row is called. */
const MODULES = [
  { key: 'projects', api: projectsApi, subject: 'project', name: (r) => r.title, path: (r) => `/admin/projects/${r.id}/edit` },
  { key: 'services', api: servicesApi, subject: 'service', name: serviceName, path: (r) => `/admin/services/${r.id}/edit` },
  { key: 'industries', api: industriesApi, subject: 'industry', name: industryName, path: (r) => `/admin/industries/${r.id}/edit` },
  { key: 'products', api: productsApi, subject: 'product', name: (r) => r.title, path: (r) => `/admin/products/${r.id}/edit` },
  { key: 'testimonials', api: reviewsApi, subject: 'testimonial', name: (r) => r.client_name, path: (r) => `/admin/testimonials/${r.id}/edit` },
  { key: 'clients', api: clientsApi, subject: 'client', name: (r) => r.name, path: (r) => `/admin/client-stories/${r.id}/edit` },
  { key: 'stories', api: successStoriesApi, subject: 'success story', name: (r) => r.title, path: () => '/admin/client-stories?tab=stories' },
  { key: 'partners', api: partnersApi, subject: 'partner', name: (r) => r.name, path: (r) => `/admin/partnerships/${r.id}/edit` },
  { key: 'team', api: teamMembersApi, subject: 'team member', name: (r) => r.name, path: (r) => `/admin/team/${r.id}` },
]

/*
 * One snapshot of everything, shared by the widgets and the range picker for a few
 * seconds so the page makes each request once. A module that fails (e.g. not deployed
 * yet) is left out instead of breaking the whole dashboard. A snapshot with failures
 * isn't kept, so "Try again" really asks the API again.
 */
const TTL_MS = 15_000
let cached = null

function loadSnapshot() {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.promise
  const promise = Promise.allSettled([inquiriesApi.all(), ...MODULES.map((m) => fetchAll(m.api))]).then(([inquiries, ...modules]) => ({
    inquiries: inquiries.status === 'fulfilled' ? inquiries.value : null,
    inquiriesError: inquiries.reason,
    modules: Object.fromEntries(MODULES.map((m, i) => [m.key, modules[i].status === 'fulfilled' ? modules[i].value : null])),
    errors: MODULES.map((m, i) => modules[i].reason).filter(Boolean),
  }))
  cached = { at: Date.now(), promise }
  promise.then((snap) => {
    if ((!snap.inquiries || snap.errors.length) && cached?.promise === promise) cached = null
  })
  return promise
}

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** First instant of a `days`-long period ending today (today counts as one day). */
const periodStart = (days) => startOfToday() - (days - 1) * DAY
const time = (iso) => (iso ? new Date(iso).getTime() : NaN)
const percent = (now, before) => (before > 0 ? Math.round(((now - before) / before) * 1000) / 10 : null)

/** Published rows now, and how that count grew since the period began (`null` when there's nothing to compare). */
function contentStat(rows, start) {
  if (!rows) return null
  const published = rows.filter((r) => r.status === 'published')
  const before = published.filter((r) => time(r.created_at) < start).length
  return { value: published.length, change: percent(published.length, before) }
}

const localDay = (ms) => {
  const d = new Date(ms)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

async function getStats(range) {
  const snap = await loadSnapshot()
  if (!snap.inquiries && Object.values(snap.modules).every((rows) => !rows)) throw snap.inquiriesError ?? snap.errors[0]

  const days = RANGE_DAYS[range]
  const start = periodStart(days)
  const prevStart = start - days * DAY
  const received = (snap.inquiries ?? []).map((q) => time(q.received_at))
  const current = received.filter((t) => t >= start).length
  const previous = received.filter((t) => t >= prevStart && t < start).length

  return {
    data: {
      inquiries: snap.inquiries ? { value: current, change: percent(current, previous) } : null,
      projects: contentStat(snap.modules.projects, start),
      services: contentStat(snap.modules.services, start),
      testimonials: contentStat(snap.modules.testimonials, start),
    },
  }
}

async function getInquiryTrend(range) {
  const snap = await loadSnapshot()
  if (!snap.inquiries) throw snap.inquiriesError

  const days = RANGE_DAYS[range]
  const start = periodStart(days)
  const points = Array.from({ length: days }, (_, i) => {
    const at = start + i * DAY
    return { key: localDay(at), date: new Date(at).toISOString(), inquiries: 0, closed: 0 }
  })
  const byDay = Object.fromEntries(points.map((p) => [p.key, p]))
  snap.inquiries.forEach((q) => {
    const point = byDay[localDay(time(q.received_at))]
    if (!point) return
    point.inquiries += 1
    if (q.status === 'closed') point.closed += 1
  })
  // An all-zero period reads as "no inquiries" rather than a flat line.
  return { data: points.some((p) => p.inquiries) ? points : [] }
}

/** Projects linked to each industry (the Industries form's "Featured projects" / `project_ids`). */
async function getProjectsByIndustry() {
  const industries = await fetchAll(industriesApi)
  const details = await Promise.all(industries.map((i) => industriesApi.get(i.id).then((r) => r.data)))
  return {
    data: details
      .map((i) => ({ id: i.id, industry: industryName(i), projects: i.project_ids?.length ?? 0 }))
      .filter((row) => row.projects > 0),
  }
}

/** Latest created / updated content across the modules, newest first. */
async function getActivity(limit = 6) {
  const snap = await loadSnapshot()
  if (Object.values(snap.modules).every((rows) => !rows)) throw snap.errors[0]

  const items = MODULES.flatMap((m) =>
    (snap.modules[m.key] ?? []).map((r) => ({
      id: `${m.key}-${r.id}`,
      module: m.key,
      subject: m.subject,
      // Saved within a minute of creation → still "added".
      action: time(r.updated_at) - time(r.created_at) < 60_000 ? 'added' : 'updated',
      target: m.name(r) || `#${r.id}`,
      href: m.path(r),
      created_at: r.updated_at ?? r.created_at,
    })),
  )
  return { data: items.sort((a, b) => time(b.created_at) - time(a.created_at)).slice(0, limit) }
}

/** Published / draft split of a module's rows (`null` when the module couldn't be loaded). */
const statusCounts = (rows) =>
  rows && {
    total: rows.length,
    published: rows.filter((r) => r.status === 'published').length,
    draft: rows.filter((r) => r.status === 'draft').length,
  }

/**
 * One summary per sidebar section, keyed like the sidebar (`nav-config.js`).
 * A section whose API failed is `null`, so its card can say so without hiding the rest.
 */
async function getSections() {
  const snap = await loadSnapshot()
  const m = snap.modules
  const inquiries = snap.inquiries
  return {
    data: {
      services: statusCounts(m.services),
      industries: statusCounts(m.industries),
      projects: statusCounts(m.projects),
      'client-stories': m.clients && { ...statusCounts(m.clients), stories: m.stories?.length ?? null },
      products: statusCounts(m.products),
      testimonials: statusCounts(m.testimonials),
      partnerships: statusCounts(m.partners),
      team: m.team && { ...statusCounts(m.team), featured: m.team.filter((r) => r.status === 'published' && r.is_featured).length },
      inquiries: inquiries && {
        total: inquiries.length,
        new: inquiries.filter((q) => q.status === 'new').length,
        unread: inquiries.filter((q) => !q.is_read).length,
      },
    },
  }
}

export const dashboardApi = {
  getStats,
  getSections,
  getInquiryTrend,
  getProjectsByIndustry,
  getActivity,
  getRecentInquiries: (limit = 5) => inquiriesApi.list({ per_page: limit }),
}
