/** Timestamps relative to "now" so mock data always looks fresh. */
export const hoursAgo = (h) => new Date(Date.now() - h * 3_600_000).toISOString()
export const daysAgo = (d) => hoursAgo(d * 24)

/** Services and industries as they appear on the public website. */
export const SITE_SERVICES = [
  'Web Development',
  'Mobile Development',
  'Cloud & Security',
  'AI & Automation',
  'Data Science',
  'Engineering',
  'Content Creation',
]

export const SITE_INDUSTRIES = ['Healthcare', 'FinTech', 'Retail', 'Real Estate', 'Education', 'Logistics']
