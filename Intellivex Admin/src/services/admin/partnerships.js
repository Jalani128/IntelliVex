import { createResource, createSingleton } from './createResource'
import { partnersMock, partnershipsPageMock, supportedPlatformsMock } from '@/mock/admin/partnerships.mock'

/**
 * Partnerships page:
 *   Part A  /partners               logos (Strategic row + Integration grid)
 *   Part B  /supported-platforms    "Platforms & Technologies Supported" cards
 *   Part C  /partnerships-page      single-row page content
 *
 * Partners and platforms have no `PATCH /{id}/status` route; status changes are
 * partial `PUT` updates. Partner images (`logo`, `success_story_image`) are
 * cleared by sending the field empty — `remove_{field}` is ignored.
 */
const withPutStatus = (api) => ({ ...api, setStatus: (id, status) => api.update(id, { status }) })

export const partnersApi = withPutStatus(
  createResource('partners', {
    seed: partnersMock,
    searchFields: ['name', 'slug'],
    imageFields: ['logo', 'success_story_image'],
  }),
)

export const platformsApi = withPutStatus(
  createResource('supported-platforms', {
    seed: supportedPlatformsMock,
    searchFields: ['title'],
    imageFields: ['icon'],
  }),
)

export const partnershipsPageApi = createSingleton('partnerships-page', {
  seed: partnershipsPageMock,
  imageFields: ['video_thumbnail'],
})

export const PUBLISH_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

export const PARTNER_TYPES = [
  { value: 'technology', label: 'Technology' },
  { value: 'strategic', label: 'Strategic' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'enterprise', label: 'Enterprise' },
]

/** Website limits: 4 logos in the Strategic row, 6 in the Integration grid, 3 platform cards. */
export const LIMITS = { strategic: 4, integration: 6, platforms: 3 }

/** Partner field limits enforced by the API. */
export const PARTNER_LIMITS = { name: 150, slug: 180, altText: 180, link: 2048, description: 5000, successStory: 10000 }
