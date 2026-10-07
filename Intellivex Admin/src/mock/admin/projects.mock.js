import { daysAgo } from './helpers'

// Portfolio (public site: /portfolio + /portfolio/{slug}) — same shape as the Laravel
// admin API in portfolio-projects-backend-spec.md.
const LOREM_LONG =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque.'
const LOREM_SHORT =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.'
const LOREM_LINE = 'Lorem ipsum dolor sit amet consectetur adipiscing elit.'

const slug = (s) => s.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// [title, badge, solution_category_id, client / industry text, featured, home]
const PROJECTS = [
  ['Intellivex Brand Identity', 'Branding', 1, 'Intellivex', true, true],
  ['Intellivex Brand Book', 'Branding', 1, 'Intellivex', true, true],
  ['Brightline Patient Portal', 'Web App', 5, 'Healthcare', true, false],
  ['Nexa Pay Wallet', 'Mobile', 4, 'Fintech', false, false],
  ['ShopSphere Cloud Migration', 'Cloud', 2, 'Retail', false, false],
  ['Freightly Route AI', 'AI', 3, 'Logistics', false, false],
]

export const projectsMock = PROJECTS.map(([title, badge, solution_category_id, client_industry_text, is_featured, show_on_home], i) => ({
  id: i + 1,
  solution_category_id,
  linked_industry_id: null,
  title,
  slug: slug(title),
  badge,
  short_description: LOREM_SHORT,
  tags: i < 2 ? ['Logo', 'Stationery Items', 'Letterhead'] : [badge, 'Design', 'Development'],
  card_image_url: null,
  card_image_alt: null,
  client_industry_text,
  client_industry_url: null,
  heading: title,
  highlight: null,
  description: `<p>${LOREM_LONG}</p>`,
  hero_image_url: null,
  hero_image_alt: null,
  gallery: [],
  challenge_title: 'The challenge of project',
  challenge_description: LOREM_LONG,
  challenges: Array.from({ length: 4 }, (_, n) => ({ id: (i + 1) * 10 + n, text: LOREM_LINE, sort_order: n })),
  case_studies_title: 'Case Studies',
  project_url: null,
  industries: [],
  status: i === 5 ? 'draft' : 'published',
  is_featured,
  show_on_home,
  sort_order: i,
  created_at: daysAgo(130 - i * 15),
  updated_at: daysAgo(20 - i),
}))

export const portfolioPageMock = {
  overview_eyebrow: 'OUR RECENT WORKS',
  overview_title: 'Best Features Provided By Intellivex',
  overview_highlight: 'Intellivex',
  overview_description:
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla os faucibus ready pulvinar vulputate neque, semper. Ornare non nulla.',
  projects_eyebrow: 'RELEVANT CASE STUDIES',
  projects_title: 'Recent Projects',
  projects_highlight: 'Projects',
  projects_description: null,
  card_button_label: 'VIEW DETAILS',
  per_page: 4,
  load_more_label: 'LOAD MORE',
  show_all_filter: false,
  all_filter_label: 'All',
  is_cta_active: true,
  cta_title: 'Reimagine your business with Intellivex',
  cta_highlight: null,
  cta_description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do',
  cta_button_label: 'Contact Us',
  cta_button_url: '/contact',
  cta_image_url: null,
  cta_image_alt: null,
  meta_title: 'Portfolio | Intellivex',
  meta_description: null,
  og_image_url: null,
  updated_at: daysAgo(6),
}
