import { createResource, createSingleton } from './createResource'
import { SITE_URL } from './config'
import {
  deployableSolutionsMock,
  productsMock,
  productsPageMock,
  solutionCategoriesMock,
} from '@/mock/admin/products.mock'

/**
 * Products page — products-backend-spec.md §3:
 *   /products               product cards (Featured + Showcase + catalog) and detail pages
 *   /solution-categories    category pills — shared with Portfolio / Projects
 *   /deployable-solutions   "Ready-to-Deploy / Customizable Solutions" cards
 *   /products-page          single-row page content
 *
 * None of these have a `PATCH /{id}/status` route; status / active changes are
 * partial `PUT` updates, which the API accepts.
 */
const withPutStatus = (api) => ({ ...api, setStatus: (id, status) => api.update(id, { status }) })

export const productsApi = withPutStatus(
  createResource('products', {
    seed: productsMock,
    searchFields: ['title', 'badge', 'slug'],
    imageFields: ['image'],
    // Gallery items go up and come back as `images: [{ id?, image, image_alt, sort_order }]`.
    galleryFields: ['images'],
  }),
)

export const categoriesApi = createResource('solution-categories', {
  seed: solutionCategoriesMock,
  searchFields: ['title', 'slug'],
})

export const solutionsApi = withPutStatus(
  createResource('deployable-solutions', {
    seed: deployableSolutionsMock,
    searchFields: ['title'],
    imageFields: ['icon'],
  }),
)

export const productsPageApi = createSingleton('products-page', {
  seed: productsPageMock,
  imageFields: ['cta_image', 'og_image'],
})

export const PUBLISH_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

/** API limits per section and field. */
export const LIMITS = {
  featured: 2,
  showcase: 2,
  solutions: 3,
  useCases: 2,
  activeCategories: 5,
  tags: 5,
  tagLength: 50,
  features: 30,
  featureLength: 300,
  gallery: 12,
}

/** Upload limits in MB, per the API rules. */
export const IMAGE_MB = { card: 3, gallery: 5, icon: 1, page: 3 }

/** Solution categories come back as `{ title, is_active }`. */
export const categoryLabel = (c) => c?.title ?? c?.name ?? ''
export const categoryActive = (c) => c?.is_active ?? c?.status === 'published'

/** Public product page URL, when the website URL is configured. */
export const productSiteUrl = (product) => (SITE_URL && product?.slug ? `${SITE_URL}/products/${product.slug}` : null)
