import { createResource, createSingleton } from './createResource'
import { SITE_URL } from './config'
import { industriesMock, industriesPageMock } from '@/mock/admin/industries.mock'

/**
 * Website industries — industries-backend-spec.md:
 *   /industries        list, CRUD, `PATCH /{id}/status`; `icon`, `image`, `og_image`
 *                      go up as files and come back as `*_url`; `challenges[]`,
 *                      `service_ids[]` and `project_ids[]` replace the stored lists
 *   /industries-page   single-row Industries page content
 */
export const industriesApi = createResource('industries', {
  seed: industriesMock,
  searchFields: ['title', 'highlight', 'slug'],
  imageFields: ['icon', 'image', 'og_image'],
})

export const industriesPageApi = createSingleton('industries-page', {
  seed: industriesPageMock,
  imageFields: ['cta_image', 'og_image'],
})

export const INDUSTRY_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

/** API limits. */
export const LIMITS = { challenges: 20, challengeLength: 300, descriptionLength: 20000 }

/** Upload limits in MB, per the API rules. */
export const IMAGE_MB = { icon: 1, image: 5, og: 3, page: 3 }

/**
 * Display name. The API keeps the highlight inside the title ("FinTech" /
 * "FinTech"); older records held only the plain part ("Financial Services &" /
 * "FinTech") — both come out right.
 */
export const industryName = (i) => {
  const title = i?.title ?? ''
  const highlight = i?.highlight ?? ''
  if (!highlight || title.toLowerCase().includes(highlight.toLowerCase())) return title
  return [title, highlight].filter(Boolean).join(' ')
}

/** Public Industry Details URL, when the website URL is configured. */
export const industrySiteUrl = (industry) => (SITE_URL && industry?.slug ? `${SITE_URL}/industries/${industry.slug}` : null)
