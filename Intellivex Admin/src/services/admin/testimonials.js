import { createResource, createSingleton } from './createResource'
import { SITE_URL } from './config'
import { clientsMock, reviewsMock, successStoriesMock, testimonialsPageMock } from '@/mock/admin/testimonials.mock'

/**
 * Testimonials, Clients and Success Stories — testimonials-backend-spec.md:
 *   Part A  /testimonials        client reviews (also the Home page "Real Reviews")    → Testimonials module
 *   Part B  /clients             logo bar, Client Portfolio grid + detail pages       → Client Stories module
 *   Part C  /success-stories     image cards (2 featured + 3)                         → Client Stories module
 *   Part D  /testimonials-page   single-row page content                              → Testimonials module
 *
 * Clients and stories have no `PATCH /{id}/status` route; status changes are
 * partial `PUT` updates, which the API accepts. Their images (`logo`, `image`)
 * are cleared by sending the field empty — `remove_{field}` is ignored.
 */
const withPutStatus = (api) => ({ ...api, setStatus: (id, status) => api.update(id, { status }) })

export const reviewsApi = createResource('testimonials', {
  seed: reviewsMock,
  searchFields: ['client_name', 'designation', 'company', 'quote'],
  imageFields: ['avatar'],
})

export const clientsApi = withPutStatus(
  createResource('clients', {
    seed: clientsMock,
    searchFields: ['name', 'slug'],
    imageFields: ['logo'],
  }),
)

export const successStoriesApi = withPutStatus(
  createResource('success-stories', {
    seed: successStoriesMock,
    searchFields: ['title'],
    imageFields: ['image'],
  }),
)

export const testimonialsPageApi = createSingleton('testimonials-page', { seed: testimonialsPageMock })

export const PUBLISH_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

/**
 * Website / API limits per section: 4 logo-bar and 6 portfolio clients; 2 featured
 * stories and 5 published stories in total (so 3 regular).
 */
export const LIMITS = { home: 3, logoBar: 4, portfolio: 6, featuredStories: 2, stories: 3, publishedStories: 5, longText: 20000 }

/** Upload limits in MB, per the API rules. */
export const IMAGE_MB = { logo: 2, story: 5 }

/** Public Client Portfolio Details URL, when the website URL is configured. */
export const clientSiteUrl = (client) => (SITE_URL && client?.slug ? `${SITE_URL}/client-portfolio/${client.slug}` : null)

/** "CEO" + "Brightline Health" → "CEO, Brightline Health" */
export const reviewRole = (r) => [r?.designation, r?.company].filter(Boolean).join(', ')
