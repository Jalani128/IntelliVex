import { createResource, createSingleton } from './createResource'
import { SITE_URL } from './config'
import { portfolioPageMock, projectsMock } from '@/mock/admin/projects.mock'

/**
 * Portfolio — portfolio-projects-backend-spec.md:
 *   /projects         project cards + Project Details pages
 *   /portfolio-page   single-row page content
 * Filter pills reuse the Products module's `/solution-categories`.
 */
export const projectsApi = createResource('projects', {
  seed: projectsMock,
  searchFields: ['title', 'badge', 'client_industry_text', 'slug'],
  imageFields: ['card_image', 'hero_image'],
  galleryFields: ['gallery'],
})

export const portfolioPageApi = createSingleton('portfolio-page', {
  seed: portfolioPageMock,
  imageFields: ['cta_image', 'og_image'],
})

export const PUBLISH_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

/** API limits (tags, challenge bullets) and design limits (home, gallery). */
export const LIMITS = { home: 2, tags: 5, tagLength: 50, challenges: 12, challengeLength: 300, gallery: 12 }

/** Upload limits in MB, per the API rules. */
export const IMAGE_MB = { card: 3, hero: 5, gallery: 5, page: 3 }

/** This API clears an image when the field is sent empty (`remove_{field}` is ignored). */
export { nullableImageField as projectImage } from '@/components/admin/forms/FormFields'

/** Solution categories are owned by the Products module. */
export { categoryLabel, categoryActive } from './products'

/** Public Project Details URL, when the website URL is configured. */
export const projectSiteUrl = (project) => (SITE_URL && project?.slug ? `${SITE_URL}/portfolio/${project.slug}` : null)
