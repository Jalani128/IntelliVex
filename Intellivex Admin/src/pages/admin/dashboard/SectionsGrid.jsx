import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { NAV_ITEMS } from '@/components/admin/sidebar/nav-config'
import { FEATURED_LIMIT } from '@/services/admin/team'
import { formatNumber } from '@/lib/format'

/** Every sidebar section except the dashboard itself — new sidebar items get a card automatically. */
const SECTIONS = NAV_ITEMS.filter((item) => item.key !== 'dashboard')

const split = (s) => `${formatNumber(s.published)} published · ${formatNumber(s.draft)} draft`

/** Section summary (from dashboardApi.getSections) → the big value and the line under it. */
const SUMMARY = {
  'client-stories': (s) => ({
    value: s.total,
    unit: 'clients',
    detail: `${formatNumber(s.published)} published${s.stories != null ? ` · ${formatNumber(s.stories)} success ${s.stories === 1 ? 'story' : 'stories'}` : ''}`,
  }),
  team: (s) => ({ value: s.total, unit: 'members', detail: `${s.featured} / ${FEATURED_LIMIT} on website · ${formatNumber(s.draft)} draft` }),
  inquiries: (s) => ({ value: s.total, unit: 'total', detail: `${formatNumber(s.new)} new · ${formatNumber(s.unread)} unread` }),
}

function summarize(key, data) {
  if (!data) return { detail: 'Couldn’t load this section' }
  return SUMMARY[key]?.(data) ?? { value: data.total, unit: 'total', detail: split(data) }
}

function SectionCard({ item, data, isLoading, known }) {
  const { label, path, icon: Icon } = item
  const summary = known ? summarize(item.key, data) : { detail: 'Open section' }

  return (
    <Link
      to={path}
      aria-label={`${label}: open section`}
      className="group block rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Card className="h-full gap-0 p-5 transition-colors group-hover:border-primary/40 group-hover:bg-accent/30">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
            <Icon className="size-5" strokeWidth={1.8} />
          </span>
        </div>
        {isLoading ? (
          <>
            <Skeleton className="mt-1 h-8 w-16" />
            <Skeleton className="mt-3 h-4 w-32" />
          </>
        ) : (
          <>
            <p className="-mt-1 font-display text-[26px] leading-9 font-medium tracking-tight">
              {summary.value == null ? '—' : formatNumber(summary.value)}
              {summary.unit && summary.value != null && <span className="ml-1.5 text-sm font-normal text-muted-foreground">{summary.unit}</span>}
            </p>
            <div className="mt-2 flex items-start gap-2 text-xs leading-snug text-muted-foreground">
              <span className="min-w-0">{summary.detail}</span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </>
        )}
      </Card>
    </Link>
  )
}

/** One card per sidebar section with its counts; each opens that section. */
export default function SectionsGrid({ query }) {
  const sections = query.data?.data ?? {}
  const loading = query.isLoading && !query.data

  return (
    <section aria-labelledby="sections-heading" className="space-y-3">
      <div>
        <h2 id="sections-heading" className="font-display text-base font-medium">
          Website sections
        </h2>
        <p className="text-sm text-muted-foreground">Everything in the sidebar at a glance — open a card to manage that section.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {SECTIONS.map((item) => (
          <SectionCard key={item.key} item={item} data={sections[item.key]} isLoading={loading} known={item.key in sections || !query.data} />
        ))}
      </div>
    </section>
  )
}
