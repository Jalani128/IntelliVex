import { daysAgo } from './helpers'

// Partnerships page (public site: /partnerships) — see docs/partnerships-backend-spec.
const LOREM_LONG =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque.'
const LOREM_SHORT =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.'

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// [name, type, strategic row, integration grid]
const PARTNERS = [
  ['Logoipsum Globe', 'technology', true, false],
  ['Logoipsum Leaf', 'strategic', true, false],
  ['Logoipsum Dots', 'technology', true, false],
  ['Logoipsum Wave', 'strategic', true, false],
  ['Cloud Partner', 'cloud', false, true],
  ['LGPSM', 'enterprise', false, true],
  ['Geometric Partner', 'technology', false, true],
  ['Orbit Systems', 'cloud', false, true],
  ['Northwind Labs', 'enterprise', false, true],
  ['Vertex Cloud', 'cloud', false, true],
]

export const partnersMock = PARTNERS.map(([name, type, show_as_strategic, show_as_integration], i) => ({
  id: i + 1,
  name,
  slug: slug(name),
  logo_url: null,
  alt_text: `${name} logo`,
  website_link: null,
  type,
  show_as_strategic,
  show_as_integration,
  status: i === 9 ? 'draft' : 'published',
  sort_order: show_as_strategic ? i : i - 4,
  description: null,
  success_story: null,
  success_story_image_url: null,
  created_at: daysAgo(60 - i),
  updated_at: daysAgo(20 - i),
}))

export const supportedPlatformsMock = ['Engineering', 'Mobile Development', 'Cloud & Security'].map((title, i) => ({
  id: i + 1,
  title,
  description: LOREM_SHORT,
  icon_url: null,
  link: '',
  status: 'published',
  sort_order: i,
  created_at: daysAgo(40 - i),
  updated_at: daysAgo(40 - i),
}))

export const partnershipsPageMock = {
  intro_eyebrow: 'OVERVIEW',
  intro_title: 'Passion and innovation Shape',
  intro_highlight: 'our',
  intro_title_tail: 'Journey',
  intro_description: LOREM_LONG,
  intro_button_label: "LET'S TALK TOGETHER",
  intro_button_link: '/contact',
  strategic_eyebrow: 'OVERVIEW',
  strategic_title: 'Technology & Strategic',
  strategic_highlight: 'Partners',
  strategic_description: LOREM_LONG,
  integration_eyebrow: 'OVERVIEW',
  integration_title: 'Partner / Integration',
  integration_highlight: 'Logos',
  video_eyebrow: 'OVERVIEW',
  video_title: 'Technology',
  video_highlight: 'Integrations',
  video_url: '',
  video_thumbnail_url: null,
  video_thumbnail_alt: 'Technology Integrations Video',
  platforms_eyebrow: 'OVERVIEW',
  platforms_title: 'Platforms & Technologies',
  platforms_highlight: 'Supported',
  platforms_button_label: 'VIEW ALL',
  platforms_button_link: '/services',
  cta_title_line1: 'Become a Partner or Discuss',
  cta_title_line2: 'Integration',
  cta_description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do',
  cta_button_label: 'BECOME A PARTNER',
  cta_button_link: '/contact',
  meta_title: 'Partnerships | Intellivex',
  meta_description: '',
  updated_at: daysAgo(5),
}
