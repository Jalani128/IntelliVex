import { daysAgo } from './helpers'
import softwareEngineeringIcon from '@/assets/website/software-engineering.png'
import mobileDevelopmentIcon from '@/assets/website/mobile-development.png'
import cloudCybersecurityIcon from '@/assets/website/cloud-cybersecurity.png'
import webDevelopmentIcon from '@/assets/website/web-development.png'
import gameDevelopmentIcon from '@/assets/website/game-development.png'

// Services as they appear on the public site (Services page catalog, home grid, header menu).
const LOREM_SHORT =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.'
const LOREM_LONG =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque.'
const BENEFIT = 'Lorem ipsum dolor sit amet consectetur adipiscing elit.'

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const base = (id, fields) => {
  const updated_at = daysAgo(id * 2)
  const title = fields.title
  return {
    id,
    parent_id: null,
    highlight: null,
    slug: slugify(`${title} ${fields.highlight ?? ''}`),
    eyebrow: 'Service',
    card_variant: 'default',
    short_description: LOREM_SHORT,
    // Rich text, as the API stores it (sanitised HTML).
    description: `<p>${LOREM_LONG}</p><p>${LOREM_SHORT}</p>`,
    icon_url: null,
    image_url: null,
    image_alt: '',
    tags: [],
    benefits_title: 'Our Benefits',
    benefits_description: LOREM_LONG,
    benefits: Array.from({ length: 4 }, (_, i) => ({ id: id * 10 + i, text: BENEFIT, sort_order: i })),
    faqs: [
      { id: id * 10, question: 'Lorem ipsum dolor sit amet consectetur adipiscing elit?', answer: `${LOREM_SHORT} ${LOREM_SHORT}`, is_active: true, sort_order: 0 },
      { id: id * 10 + 1, question: 'Lorem ipsum dolor sit amet elit?', answer: `${LOREM_SHORT} ${LOREM_SHORT}`, is_active: true, sort_order: 1 },
    ],
    industry_ids: [],
    status: 'published',
    is_featured: false,
    show_in_menu: false,
    show_on_services_page: true,
    sort_order: id,
    meta_title: '',
    meta_description: '',
    og_image_url: null,
    created_at: daysAgo(60 - id),
    updated_at,
    ...fields,
  }
}

/** Card tags (sub-services) as the API returns them: [{ id, text, sort_order }]. */
const tags = (id, list) => list.map((text, i) => ({ id: id * 100 + i, text, sort_order: i }))

/*
 * "Our Services" cards from the IntelliVex website content file. AI & Data Innovation comes first (sort_order 0).
 * Icons are the ones the website already uses for these cards.
 */
export const servicesMock = [
  base(1, {
    title: 'Software Engineering',
    slug: 'engineering',
    short_description:
      'We engineer robust, cloud-native software tailored to your business, from architecture and APIs to deployment and long-term evolution.',
    icon_url: softwareEngineeringIcon,
    tags: tags(1, [
      'Custom Software Development',
      'Software Architecture & Microservices',
      'API Development & Integration',
      'DevOps & CI/CD',
      'QA & Test Automation',
      'Legacy Modernization',
    ]),
    is_featured: true,
    show_in_menu: true,
    sort_order: 1,
    industry_ids: [1, 2, 3],
  }),
  base(2, {
    title: 'Mobile Development',
    short_description:
      'We create high-performance, user-first mobile apps for iOS and Android that engage users, drive retention and grow revenue.',
    icon_url: mobileDevelopmentIcon,
    tags: tags(2, [
      'Native iOS Development',
      'Native Android Development',
      'Cross-Platform Apps (Flutter & React Native)',
      'Mobile UI/UX Design',
      'App Maintenance & Support',
      'App Store Optimization (ASO)',
    ]),
    is_featured: true,
    show_in_menu: true,
    sort_order: 2,
    industry_ids: [1, 2, 3],
  }),
  base(3, {
    title: 'Cloud & Cybersecurity',
    slug: 'cloud-security',
    short_description:
      'We architect secure, resilient cloud environments that protect your data, optimize costs and scale on demand.',
    icon_url: cloudCybersecurityIcon,
    tags: tags(3, [
      'Cloud Migration & Modernization',
      'AWS, Azure & Google Cloud',
      'Cloud Architecture',
      'Cybersecurity Assessments & Audits',
      'Data Protection & Compliance',
      'Managed Cloud & FinOps',
    ]),
    is_featured: true,
    show_in_menu: true,
    sort_order: 3,
    industry_ids: [1, 2, 3],
  }),
  base(4, {
    title: 'AI &',
    highlight: 'Data Innovation',
    slug: 'ai-data-innovation',
    card_variant: 'innovation',
    short_description:
      'We turn your data into a competitive advantage with AI that automates work, predicts what’s next and unlocks new growth.',
    tags: tags(4, [
      'Generative AI Consulting',
      'Agentic AI & AI Agents',
      'Custom AI & LLM Development',
      'Machine Learning & Predictive Analytics',
      'Data Science & Business Intelligence',
      'Intelligent Automation',
      'AI Readiness Workshops',
    ]),
    sort_order: 0,
  }),
  base(5, {
    title: 'Web Development',
    short_description:
      'We build fast, secure, conversion-focused websites and web apps that deliver seamless experiences on every device.',
    icon_url: webDevelopmentIcon,
    tags: tags(5, [
      'Custom Web Applications',
      'E-Commerce Development',
      'CMS Development',
      'Progressive Web Apps (PWA)',
      'Web UI/UX Design',
      'Website Care & Maintenance',
    ]),
    sort_order: 4,
  }),
  base(6, {
    title: 'Game Development',
    short_description:
      'We craft immersive, engaging games for mobile, web and PC, from creative concept to global launch and LiveOps.',
    icon_url: gameDevelopmentIcon,
    tags: tags(6, [
      'Mobile Game Development',
      'Multiplayer & Online Games',
      '2D & 3D Game Art & Design',
      'Unity Development',
      'LiveOps & Post-Launch Updates',
      'Gamification & Educational Games',
    ]),
    sort_order: 5,
  }),
]
