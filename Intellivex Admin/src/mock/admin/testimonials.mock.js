import { daysAgo } from './helpers'

// Testimonials page (public site: /testimonials) — see docs/testimonials-backend-spec.
const LOREM_LONG =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque.'
const LOREM_SHORT =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.'

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// [name, logo bar, portfolio grid]
const CLIENTS = [
  ['Logoipsum Globe', true, false],
  ['Logoipsum Leaf', true, false],
  ['Logoipsum Squares', true, false],
  ['Logoipsum Wave', true, false],
  ['Brightline Health', false, true],
  ['Nexa Pay', false, true],
  ['UrbanNest Realty', false, true],
  ['ShopSphere', false, true],
  ['LearnLoop', false, true],
  ['Freightly', false, true],
]

export const clientsMock = CLIENTS.map(([name, show_in_logo_bar, show_in_portfolio], i) => ({
  id: i + 1,
  name,
  slug: slug(name),
  href: `/client-portfolio/${slug(name)}`,
  logo_url: null,
  website: null,
  industry: null,
  portfolio_heading: `Empowering ${name} With Advanced Tech Solutions`,
  portfolio_description: `<p>${LOREM_LONG}</p><p>${LOREM_SHORT}</p>`,
  success_story: `<p>${LOREM_LONG}</p>`,
  show_in_logo_bar,
  show_in_portfolio,
  status: 'published',
  sort_order: show_in_logo_bar ? i : i - 4,
  created_at: daysAgo(80 - i),
  updated_at: daysAgo(30 - i),
}))

const REVIEWS = [
  ['Sarah Mitchell', 'CEO', 'Brightline Health', 5, 5, true],
  ['Omar Haddad', 'CTO', 'Nexa Pay', 5, 6, true],
  ['Emily Carter', 'Head of Product', 'UrbanNest Realty', 5, 7, true],
  ['Daniel Kim', 'Founder', 'ShopSphere', 4, 8, false],
  ['Aisha Rahman', 'Operations Lead', 'LearnLoop', 5, 9, false],
]

export const reviewsMock = REVIEWS.map(([client_name, designation, company, rating, client_id, show_on_home], i) => ({
  id: i + 1,
  client_name,
  designation,
  company,
  quote: LOREM_SHORT,
  rating,
  avatar_url: null,
  client_id,
  status: i === 4 ? 'draft' : 'published',
  show_on_home,
  show_on_testimonials_page: true,
  sort_order: i,
  created_at: daysAgo(50 - i * 3),
  updated_at: daysAgo(12 - i),
}))

export const successStoriesMock = [
  'Rebuilding a patient portal in eight weeks',
  'A mobile wallet MVP for iOS and Android',
  'AI-assisted property listings',
  'Cloud migration before peak season',
  'Engagement dashboards for 40k students',
].map((title, i) => ({
  id: i + 1,
  title,
  image_url: null,
  link: '/portfolio',
  client_id: i + 5,
  project_id: null,
  is_featured: i < 2,
  status: 'published',
  sort_order: i < 2 ? i : i - 2,
  created_at: daysAgo(45 - i),
  updated_at: daysAgo(15 - i),
}))

export const testimonialsPageMock = {
  portfolio_eyebrow: 'OUR CLIENTS',
  portfolio_title: 'Client',
  portfolio_highlight: 'Portfolio',
  portfolio_description: `${LOREM_LONG}\n\n${LOREM_SHORT}`,
  reviews_eyebrow: 'TESTIMONIALS',
  reviews_title: 'Real',
  reviews_highlight: 'Reviews',
  reviews_limit: 3,
  stories_eyebrow: 'TESTIMONIALS',
  stories_title: 'Success',
  stories_highlight: 'Stories',
  cta_title_line1: 'Ready to discuss your',
  cta_title_line2: 'Industry Requirements?',
  cta_description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do',
  cta_button_label: 'START A PROJECT',
  cta_button_link: '/contact',
  meta_title: 'Testimonials | Intellivex',
  meta_description: '',
  updated_at: daysAgo(4),
}
