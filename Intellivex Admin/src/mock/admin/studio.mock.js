import { daysAgo } from './helpers'

// Game Studio seeds for `npm run dev:mock` (shapes follow the Laravel studio controllers).
const stamp = (i) => ({ created_at: daysAgo(20 - i), updated_at: daysAgo(5 - i) })

export const studioGamesMock = [
  ['Neon Drift', 'Racing', 'published'],
  ['Skyforge Legends', 'RPG', 'published'],
  ['Pocket Kingdoms', 'Strategy', 'draft'],
].map(([title, genre, status], i) => ({
  id: i + 1, title, slug: title.toLowerCase().replace(/\s+/g, '-'), genre, status, sort_order: i,
  description: `${title} is a ${genre.toLowerCase()} game from IntelliVex Studio.`, features_intro: '', features: ['Online multiplayer', 'Cross-platform saves'],
  platforms: ['mobile', 'pc'], categories: ['mobile'], downloads: '1M+', rating: '4.6', reviews: '12K', download_url: '', image_url: null, ...stamp(i),
}))

export const studioNewsMock = [
  ['Neon Drift launches worldwide', 'published'],
  ['Behind the art of Skyforge', 'published'],
  ['Studio expansion plans', 'draft'],
].map(([title, status], i) => ({
  id: i + 1, title, slug: title.toLowerCase().replace(/\s+/g, '-'), status, excerpt: `${title}.`, body: [`${title}.`],
  published_at: daysAgo(10 * (i + 1)).slice(0, 10), image_position: 'center', image_url: null, ...stamp(i),
}))

export const studioJobsMock = [
  ['Unity Developer', 'Engineering', 'published'],
  ['3D Environment Artist', 'Art', 'published'],
  ['Game Designer', 'Design', 'draft'],
].map(([title, category, status], i) => ({
  id: i + 1, title, slug: title.toLowerCase().replace(/\s+/g, '-'), category, status, summary: `Join us as a ${title}.`, description: '',
  requirements: '', why_join: '', perks: ['Remote friendly'], salary: '', employment_type: 'Full-time', location: 'Baku', experience: '2+ years',
  work_mode: 'Hybrid', posted_at: daysAgo(i + 2).slice(0, 10), ...stamp(i),
}))

export const studioMembersMock = [['Aylin Mammadova', 'Creative Director'], ['Rashad Aliyev', 'Lead Engineer'], ['Nigar Hasanova', 'Art Lead']]
  .map(([name, role], i) => ({ id: i + 1, name, role, status: 'published', sort_order: i, image_url: null, ...stamp(i) }))

export const studioReviewsMock = [['Kamran Ismayilov', 'Producer, PlayNest'], ['Sara Lind', 'CEO, Nordic Pixel']]
  .map(([name, role], i) => ({ id: i + 1, name, role, quote: 'A reliable team that ships polished games on time.', status: 'published', sort_order: i, image_url: null, ...stamp(i) }))

export const studioPartnersMock = ['PlayNest', 'Nordic Pixel', 'Arcadia Labs']
  .map((name, i) => ({ id: i + 1, name, status: 'published', sort_order: i, image_url: null, ...stamp(i) }))

export const studioInquiriesMock = [
  { id: 1, full_name: 'Elvin Quliyev', email: 'elvin@example.com', phone: '+994 50 000 0000', subject: 'Mobile game idea', budget: '$10k–$25k', game_type: 'Mobile', message: 'We would like a casual puzzle game for iOS and Android.', created_at: daysAgo(1) },
  { id: 2, full_name: 'Mira Stone', email: 'mira@example.com', phone: '', subject: 'Porting', budget: '', game_type: 'PC', message: 'Can you port our PC title to consoles?', created_at: daysAgo(3) },
]

export const studioSubscribersMock = [
  { id: 1, email: 'fan@example.com', created_at: daysAgo(2) },
  { id: 2, email: 'player@example.com', created_at: daysAgo(6) },
]

export const studioApplicationsMock = [
  { id: 1, name: 'Tural Babayev', email: 'tural@example.com', phone: '+994 55 000 0000', job_title: 'Unity Developer', message: 'Five years of Unity experience.', cv_extension: 'pdf', created_at: daysAgo(2) },
]
