import { SITE_INDUSTRIES } from './helpers'

// 90 days of daily inquiry counts (oldest first) — a smooth trend with weekly dips.
export const inquiryTrendMock = Array.from({ length: 90 }, (_, i) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - (89 - i))
  const weekend = [0, 6].includes(date.getDay())
  const base = 3 + i * 0.04 + Math.sin(i / 6) * 1.6
  const inquiries = Math.max(0, Math.round(base * (weekend ? 0.45 : 1) + ((i * 7) % 3)))
  return { date: date.toISOString().slice(0, 10), inquiries, converted: Math.round(inquiries * 0.32) }
})

// Headline numbers per date range. `change` is % vs the previous period.
// Inquiry totals are summed from the trend above so the stat card and chart always agree.
const sumLast = (days) => inquiryTrendMock.slice(-days).reduce((sum, d) => sum + d.inquiries, 0)

export const statsMock = {
  '7d': { inquiries: { value: sumLast(7), change: 12.4 }, projects: { value: 14, change: 7.1 }, services: { value: 7, change: 0 }, testimonials: { value: 42, change: 4.8 } },
  '30d': { inquiries: { value: sumLast(30), change: 18.2 }, projects: { value: 14, change: 16.7 }, services: { value: 7, change: 16.7 }, testimonials: { value: 42, change: 10.5 } },
  '90d': { inquiries: { value: sumLast(90), change: -3.6 }, projects: { value: 14, change: 40 }, services: { value: 7, change: 40 }, testimonials: { value: 42, change: 27.3 } },
}

export const projectsByIndustryMock = SITE_INDUSTRIES.map((industry, i) => ({
  industry,
  projects: [4, 3, 2, 2, 2, 1][i],
}))
