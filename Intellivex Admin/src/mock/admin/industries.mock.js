import { daysAgo } from './helpers'
import { servicesMock } from './services.mock'

// Industries — same shapes as the Laravel admin API in industries-backend-spec.md.
const LOREM_SHORT =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.'
const LOREM_LONG =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque.'
const LOREM_LINE = 'Lorem ipsum dolor sit amet consectetur adipiscing elit.'

// [title, highlight (part of the title), slug]
const INDUSTRIES = [
  ['FinTech', 'FinTech', 'fintech'],
  ['Healthcare', 'Healthcare', 'healthcare'],
  ['Retail', 'Retail', 'retail'],
  ['Education', 'Education', 'education'],
  ['Logistics', 'Logistics', 'logistics'],
  ['Real Estate', 'Real Estate', 'real-estate'],
]

// Portfolio projects per industry (ids in projects.mock.js).
const PROJECT_IDS = { fintech: [4], healthcare: [3], retail: [5], logistics: [6] }

export const industriesMock = INDUSTRIES.map(([title, highlight, slug], i) => {
  const id = i + 1
  return {
    id,
    title,
    highlight,
    slug,
    icon_url: null,
    short_description: LOREM_SHORT,
    button_label: 'DISCOVER',
    eyebrow: 'Industry',
    description: `<p>${LOREM_LONG}</p><p>${LOREM_SHORT}</p>`,
    image_url: null,
    image_alt: null,
    challenges_title: 'Key Challenges',
    challenges: Array.from({ length: 4 }, (_, n) => ({ id: id * 10 + n, text: LOREM_LINE, sort_order: n })),
    case_studies_title: 'Case Studies',
    // Same pivot the Services form edits (`industry_ids`), seen from this side.
    service_ids: servicesMock.filter((s) => s.industry_ids?.includes(id)).map((s) => s.id),
    project_ids: PROJECT_IDS[slug] ?? [],
    status: i < 5 ? 'published' : 'draft',
    is_featured: i < 3,
    show_in_menu: i < 4,
    sort_order: i + 1,
    meta_title: null,
    meta_description: null,
    og_image_url: null,
    created_at: daysAgo(90 - i),
    updated_at: daysAgo(10 - i),
  }
})

export const industriesPageMock = {
  overview_title: 'Digital solutions for every industry',
  overview_highlight: 'every industry',
  overview_description: LOREM_LONG,
  industries_title: 'Industries We Serve',
  industries_highlight: 'Industries',
  industries_description: LOREM_SHORT,
  featured_projects_title: 'Featured Projects',
  featured_projects_highlight: 'Featured',
  featured_projects_description: LOREM_SHORT,
  featured_projects_limit: 3,
  cta_title: 'Ready to solve your industry challenge?',
  cta_highlight: null,
  cta_description: null,
  cta_button_label: "LET'S TALK",
  cta_button_url: '/contact',
  cta_image: null,
  cta_image_alt: null,
  meta_title: 'Industries We Serve | Intellivex',
  meta_description: null,
  og_image: null,
  updated_at: daysAgo(4),
}
