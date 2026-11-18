/**
 * Open roles (Figma Careers 593:783, Careers Details 597:1534). The design repeats one
 * placeholder job; swap in the real roles here until the Admin panel manages them.
 */
const SUMMARY = 'Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng'
const TEXT = 'Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng'

const placeholder = (n) => ({
  slug: `2d-3d-artist-${n}`,
  category: 'Design',
  title: 'Immediate Hiring | 2D & 3D Artist',
  summary: SUMMARY,
  // Detail page sections (title + text), then the perks checklist.
  sections: [
    { title: null, text: TEXT },
    { title: 'Requirements', text: TEXT },
    { title: 'Why Intellivex studio', text: TEXT },
  ],
  perks: ['Lorem ipsum dolor sitamet const adipiscng', 'Lorem ipsum dolor sitamet const adipiscng', 'Lorem ipsum dolor sitamet const adipiscng'],
  facts: [
    { label: 'Salary', value: 'Discussed in offer' },
    { label: 'Type', value: 'Full-time' },
    { label: 'Location', value: 'Garden Town Lahore' },
    { label: 'Experience', value: '2+ years' },
    { label: 'Work mode', value: 'On-site' },
    { label: 'Posted', value: 'October 2, 2026' },
  ],
  applyUrl: null, // until there is an application form, Apply Now goes to Contact
})

export const JOBS = [1, 2, 3, 4, 5, 6].map(placeholder)

export const JOB_CATEGORIES = [...new Set(JOBS.map((j) => j.category))]

export const findJob = (slug) => JOBS.find((j) => j.slug === slug)
