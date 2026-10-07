import { daysAgo } from './helpers'

// Products page (public site: /products) — same shapes as the Laravel admin API
// in products-backend-spec.md.
const LOREM_LONG =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque.'
const LOREM_SHORT =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.'

const slug = (s) => s.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export const solutionCategoriesMock = ['Web & Mobile', 'AI & Data', 'Cloud Solutions', 'Enterprise Software', 'Digital Products'].map(
  (title, i) => ({
    id: i + 1,
    title,
    slug: slug(title),
    is_active: true,
    sort_order: i + 1,
    created_at: daysAgo(70 - i),
    updated_at: daysAgo(70 - i),
  }),
)

const categoryRef = (id) => {
  const c = solutionCategoriesMock.find((x) => x.id === id)
  return { id: c.id, title: c.title, slug: c.slug }
}

// [title, badge, solution_category_id, featured, showcase, alt]
const PRODUCTS = [
  ['Intellivex Marketing Hub', 'Branding', 5, true, false, 'Intellivex Dedicated IT & Marketing Platform'],
  ['Intellivex POS', 'SaaS', 4, true, false, 'Intellivex Advanced POS and CRM Platform'],
  ['Intellivex CRM', 'SaaS', 4, false, true, 'Intellivex CRM dashboard'],
  ['Fleet Tracker', 'Mobile', 1, false, true, 'Fleet Tracker mobile app'],
  ['Insight AI', 'AI', 2, false, false, 'AI analytics dashboard'],
]

export const productsMock = PRODUCTS.map(([title, badge, solution_category_id, is_featured, show_in_showcase, image_alt], i) => ({
  id: i + 1,
  solution_category_id,
  category: categoryRef(solution_category_id),
  title,
  slug: slug(title),
  badge,
  short_description: LOREM_SHORT,
  tags: ['Light', 'Stationery Items', 'Letterhead'],
  image_url: null,
  image_alt,
  demo_url: show_in_showcase ? `https://demo.intellivex.com/${slug(title)}` : null,
  description: `<p>${LOREM_LONG}</p>`,
  features: ['Role-based access', 'Real-time dashboards', 'Cloud hosted'],
  images: [],
  is_featured,
  show_in_showcase,
  status: i === 4 ? 'draft' : 'published',
  sort_order: i,
  created_at: daysAgo(50 - i * 4),
  updated_at: daysAgo(14 - i),
}))

export const deployableSolutionsMock = ['Engineering', 'Mobile Development', 'Cloud & Security'].map((title, i) => ({
  id: i + 1,
  title,
  description: LOREM_SHORT,
  icon_url: null,
  link: '/services',
  status: 'published',
  sort_order: i,
  created_at: daysAgo(60 - i),
  updated_at: daysAgo(60 - i),
}))

export const productsPageMock = {
  hero_eyebrow: 'SERVICES OVERVIEW',
  hero_title: 'Innovative and modern IT Products & solutions',
  hero_highlight: 'Products',
  hero_description: LOREM_LONG,
  categories_title: 'Solution Categories',
  categories_highlight: 'Categories',
  featured_title: 'Featured Products',
  featured_highlight: 'Products',
  showcase_title: 'Product Showcase',
  showcase_highlight: 'Showcase',
  deployable_title: 'Ready-to-Deploy / Customizable Solutions',
  deployable_highlight: 'Customizable Solutions',
  use_cases_title: 'Industries / Use Cases',
  use_cases_highlight: 'Use Cases',
  product_button_label: 'VIEW DETAILS',
  demo_button_label: 'VIEW DEMO',
  deployable_button_label: 'DISCOVER',
  view_all_button_label: 'VIEW ALL',
  cta_title: 'Become a Partner or Discuss Integration',
  cta_highlight: null,
  cta_description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do',
  cta_button_label: 'BECOME A PARTNER',
  cta_button_url: '/contact',
  cta_image_url: null,
  cta_image_alt: null,
  meta_title: 'Products | Intellivex',
  meta_description: null,
  og_image_url: null,
  use_case_industries: [],
  updated_at: daysAgo(3),
}
