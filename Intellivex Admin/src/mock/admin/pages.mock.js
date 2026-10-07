import { daysAgo } from './helpers'
import trustedPartnersLogo from '@/assets/website/trusted-partners-logo.png'
import servicesOverviewImage from '@/assets/website/services-overview.png'

/*
 * Page content (single-row endpoints) seeded from the IntelliVex website content file.
 * Headings follow the API convention: `*_title` is the whole heading and
 * `*_highlight` the phrase inside it that takes the gradient.
 */

const DIFFERENTIATORS = {
  differentiators_eyebrow: 'Why IntelliVex',
  differentiators_title: 'The IntelliVex Advantage',
  differentiators_highlight: 'Advantage',
  differentiators_description:
    'We don’t just write code; we engineer outcomes. Our blend of technical depth, industry insight and a client-first mindset means every solution is future-proof, cost-efficient and built to deliver measurable business value from day one.',
  differentiators_items: [
    'One partner, end-to-end: from strategy to support.',
    'AI-first thinking built into every solution.',
    'Dedicated AI, cloud and security specialists.',
    'Agile sprints with full, real-time visibility.',
    'Security-by-design, compliance-ready from day one.',
    'A long-term partnership that continues beyond go-live.',
  ],
}

const CTA = {
  cta_title_line1: 'Reimagine your',
  cta_title_line2: 'business with Intellivex',
  cta_description:
    'Let’s turn your ideas into intelligent, high-impact solutions. Talk to our experts and start building your competitive edge today.',
  cta_button_label: 'Book a Free Consultation',
  cta_button_link: '/contact',
}

const SERVICES_HEADING = {
  services_eyebrow: 'Overview',
  services_title: 'Capabilities That Drive Results',
  services_highlight: 'Results',
}

export const homePageMock = {
  ...DIFFERENTIATORS,
  ...SERVICES_HEADING,
  ...CTA,
  updated_at: daysAgo(1),
}

export const aboutPageMock = {
  overview_eyebrow: 'Who We Are',
  overview_title: 'Engineering Intelligent Solutions for What’s Next',
  overview_highlight: 'What’s Next',
  overview_description: [
    'IntelliVex Technologies is a full-stack digital engineering company that turns bold ideas into market-ready products. We pair deep engineering expertise with design thinking to build technology that moves your business forward, not just technology that works.',
    'AI. Cloud. Apps. Games. One partner, engineered for impact.',
    'Our multidisciplinary team of engineers, designers, data scientists and business consultants partners with organizations across healthcare, finance, retail, education, logistics and entertainment. We believe technology should do more than function; it should transform how industries operate, compete, and grow. That is why every engagement is built on three non-negotiables: it must be intelligent, it must be secure, and it must deliver measurable ROI for our clients and the communities they serve.',
  ].join('\n\n'),
  partners_title: 'Trusted Partners',
  partners_highlight: 'Partners',
  partners_description:
    'From fast-moving startups to global enterprises, organizations choose IntelliVex for innovation they can rely on and delivery they can count on.',
  partners_rating: 5,
  partners_logo_url: trustedPartnersLogo,
  vision_title: 'Our Vision',
  vision_highlight: 'Vision',
  vision_description:
    'To become a catalyst for the intelligent digital transformation of businesses worldwide—where technology, AI and human ingenuity turn complex challenges into new possibilities.',
  mission_title: 'Our Mission',
  mission_highlight: 'Mission',
  mission_description:
    'To empower businesses with intelligent, secure and future-proof digital solutions that solve real problems and unlock new growth. Through AI, cloud, custom software and immersive digital experiences, we turn complexity into competitive advantage and deliver results our clients can measure.',
  process_eyebrow: 'Our Process',
  process_title: 'From Idea to Impact',
  process_highlight: 'Impact',
  process_description:
    'Great technology starts with a clear process. Our proven three-phase delivery model keeps you in control at every stage, from the first conversation to launch day and beyond. The result: faster time-to-market, full transparency and a solution built around your goals.',
  process_steps: [
    {
      title: 'Discover & Strategize',
      description: 'We dive deep into your business, users and goals to define a clear strategy and a roadmap built for success.',
    },
    {
      title: 'Build & Iterate',
      description: 'We design, build and test in agile sprints, with regular demos so your feedback shapes every feature.',
    },
    {
      title: 'Launch & Scale',
      description: 'We launch, monitor and continuously optimize your solution, so it scales with your business and keeps delivering value.',
    },
  ],
  ...DIFFERENTIATORS,
  ...CTA,
  updated_at: daysAgo(1),
}

export const servicesPageMock = {
  overview_eyebrow: 'What We Do',
  overview_title: 'Next-Gen Technology That Powers Growth',
  overview_highlight: 'Powers Growth',
  overview_description: [
    'At IntelliVex, we deliver a complete spectrum of technology services designed to help businesses innovate faster, scale smarter and lead their markets. Whatever the challenge, our experts engineer the right solution for your goals.',
    'Technological capabilities. One accountable partner. Zero silos.',
    'Our capabilities span artificial intelligence and data science, custom software engineering, web and mobile app development, cloud infrastructure and cybersecurity, and immersive game development. Every engagement is led by specialists who speak the language of both technology and business. Whether you are a startup launching your first product or an enterprise modernizing legacy systems, we deliver solutions that grow with you.',
  ].join('\n\n'),
  overview_image_url: servicesOverviewImage,
  overview_image_alt: 'Intellivex service delivery',
  ...SERVICES_HEADING,
  ...CTA,
  updated_at: daysAgo(1),
}
