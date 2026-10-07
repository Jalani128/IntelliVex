const numberFmt = new Intl.NumberFormat('en-US')
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const shortDateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const relativeFmt = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export const formatNumber = (n) => numberFmt.format(n ?? 0)
export const formatDate = (iso) => (iso ? dateFmt.format(new Date(iso)) : '—')
export const formatShortDate = (iso) => (iso ? shortDateFmt.format(new Date(iso)) : '—')

const UNITS = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
]

/** "5 minutes ago", "yesterday", … */
export function timeAgo(iso) {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relativeFmt.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

/** URL slugs as Laravel's validation expects them: lowercase, digits, single dashes. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** "AI & Data Innovation" → "ai-data-innovation" */
export const slugify = (value = '') =>
  value
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
