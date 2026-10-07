import { daysAgo } from './helpers'

// Team & Leadership (public site: About → "Our Leadership") — see TEAM_API.md.
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// [name, designation, featured, status]
const MEMBERS = [
  ['Maya Patel', 'Chief Executive Officer', true, 'published'],
  ['Daniel Brooks', 'Chief Technology Officer', true, 'published'],
  ['Sara Ahmed', 'Head of Design', true, 'published'],
  ['Omar Farooq', 'Engineering Manager', false, 'published'],
  ['Lena Fischer', 'Product Lead', false, 'draft'],
]

export const teamMembersMock = MEMBERS.map(([name, designation, is_featured, status], i) => ({
  id: i + 1,
  name,
  slug: slug(name),
  designation,
  photo_url: null,
  photo_alt: null,
  facebook_url: null,
  instagram_url: null,
  linkedin_url: `https://www.linkedin.com/in/${slug(name)}`,
  is_featured,
  status,
  sort_order: i + 1,
  created_at: daysAgo(30 - i),
  updated_at: daysAgo(10 - i),
}))

export const teamSectionMock = {
  eyebrow: 'TEAM MEMBERS',
  title: 'Our Leadership',
  highlight: 'Leadership',
  show_view_all: true,
  view_all_label: 'VIEW ALL',
  view_all_url: '/contact',
}
