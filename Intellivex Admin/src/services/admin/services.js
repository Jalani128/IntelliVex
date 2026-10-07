import { createResource, createSingleton } from './createResource'
import { servicesMock } from '@/mock/admin/services.mock'
import { servicesPageMock } from '@/mock/admin/pages.mock'

/**
 * Website services. Payload follows docs/services-backend-spec:
 * images go up as files (`icon`, `image`, `og_image`), come back as `*_url`,
 * and `remove_{field}: true` clears an existing image.
 * `tags` (card pills) sync like `benefits`: [{ id?, text, sort_order }].
 */
export const servicesApi = createResource('services', {
  seed: servicesMock,
  searchFields: ['title', 'highlight', 'slug'],
  imageFields: ['icon', 'image', 'og_image'],
})

/**
 * Services page content (overview, "Our Services" heading, CTA) — single row,
 * GET / PUT /services-page (docs/pages-content-backend-spec.md).
 */
export const servicesPageApi = createSingleton('services-page', { seed: servicesPageMock, imageFields: ['overview_image'] })

export const SERVICE_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

export const CARD_VARIANTS = [
  { value: 'default', label: 'Default card', hint: 'Icon, title, short description and tag pills.' },
  { value: 'innovation', label: 'Innovation card', hint: 'No icon or description — title and tag pills only.' },
]

/** "AI &" + "Data Innovation" → "AI & Data Innovation" */
export const serviceName = (s) => [s?.title, s?.highlight].filter(Boolean).join(' ')
