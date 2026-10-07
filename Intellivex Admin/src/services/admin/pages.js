import { createSingleton } from './createResource'
import { aboutPageMock, homePageMock } from '@/mock/admin/pages.mock'

/**
 * Home and About Us page content — docs/pages-content-backend-spec.md.
 * Single-row endpoints: GET / PUT /home-page and /about-page.
 * Cards on the Home page come from their own modules (Services, Portfolio, Testimonials).
 */
export const homePageApi = createSingleton('home-page', { seed: homePageMock })

export const aboutPageApi = createSingleton('about-page', { seed: aboutPageMock, imageFields: ['partners_logo'] })

/** The process timeline is drawn for exactly three steps. */
export const PROCESS_STEPS = 3
