import { Link } from 'react-router-dom'
import { History } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import ChartCard from '@/components/admin/cards/ChartCard'
import QueryState from '@/components/admin/common/QueryState'
import EmptyState from '@/components/admin/common/EmptyState'
import { NAV_ITEMS } from '@/components/admin/sidebar/nav-config'
import { timeAgo } from '@/lib/format'

/** Change module → the sidebar item it lives under (for its icon). */
const NAV_KEY = { clients: 'client-stories', stories: 'client-stories', partners: 'partnerships' }
const iconFor = (module) => NAV_ITEMS.find((item) => item.key === (NAV_KEY[module] ?? module))?.icon ?? History

const skeleton = (
  <div className="space-y-5">
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="flex gap-3">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    ))}
  </div>
)

/**
 * Latest content changes across the modules, from each record's created / updated time.
 * The API keeps no audit log, so it shows what changed and when — not who changed it.
 */
export default function RecentActivity({ query, className }) {
  return (
    <ChartCard className={className} title="Recent changes" description="Latest content updates on the website">
      <QueryState
        query={query}
        skeleton={skeleton}
        isEmpty={(d) => !d?.data?.length}
        empty={<EmptyState icon={History} title="No changes yet" />}
      >
        <ol className="relative space-y-5">
          {/* timeline rail */}
          <span className="absolute top-2 bottom-2 left-4 w-px bg-border" aria-hidden />
          {query.data?.data.map((item) => {
            const Icon = iconFor(item.module)
            return (
              <li key={item.id} className="relative flex gap-3">
                <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-navy text-white ring-4 ring-card dark:bg-primary">
                  <Icon className="size-4" strokeWidth={1.8} />
                </span>
                <div className="min-w-0 pt-0.5 text-sm">
                  <p className="leading-snug">
                    <Link to={item.href} className="font-medium hover:text-primary hover:underline">
                      {item.target}
                    </Link>{' '}
                    <span className="text-muted-foreground">
                      {item.subject} {item.action}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(item.created_at)}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </QueryState>
    </ChartCard>
  )
}
