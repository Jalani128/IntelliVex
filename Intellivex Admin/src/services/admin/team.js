import { createResource, createSingleton } from './createResource'
import { teamMembersMock, teamSectionMock } from '@/mock/admin/team.mock'

/**
 * Team & Leadership — TEAM_API.md:
 *   /team-members    list (search, status, is_featured), CRUD, `PATCH /{id}/status`;
 *                    `photo` goes up as a file and comes back as `photo_url`;
 *                    `photo: null` (JSON) removes it and clears `photo_alt`
 *   /team-section    single-row "Our Leadership" heading + VIEW ALL button
 */
export const teamMembersApi = createResource('team-members', {
  seed: teamMembersMock,
  searchFields: ['name', 'slug', 'designation'],
  imageFields: ['photo'],
})

export const teamSectionApi = createSingleton('team-section', { seed: teamSectionMock })

export const TEAM_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

/** The website shows at most this many members — the API rejects a 4th published + featured one (422 on `is_featured`). */
export const FEATURED_LIMIT = 3

/** Field limits enforced by the API. */
export const TEAM_LIMITS = { name: 150, slug: 180, designation: 150, photoAlt: 180, url: 2048, photoMb: 2 }

export const SOCIAL_FIELDS = [
  { name: 'facebook_url', label: 'Facebook', placeholder: 'https://www.facebook.com/…' },
  { name: 'instagram_url', label: 'Instagram', placeholder: 'https://www.instagram.com/…' },
  { name: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/…' },
]
