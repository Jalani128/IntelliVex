import { History } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import ChartCard from '@/components/admin/cards/ChartCard'
import QueryState from '@/components/admin/common/QueryState'
import EmptyState from '@/components/admin/common/EmptyState'
import { initials, timeAgo } from '@/lib/format'

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

export default function RecentActivity({ query, className }) {
  return (
    <ChartCard className={className} title="Recent activity" description="Changes made by your team">
      <QueryState
        query={query}
        skeleton={skeleton}
        isEmpty={(d) => !d?.data?.length}
        empty={<EmptyState icon={History} title="No activity yet" />}
      >
        <ol className="relative space-y-5">
          {/* timeline rail */}
          <span className="absolute top-2 bottom-2 left-4 w-px bg-border" aria-hidden />
          {query.data?.data.map((item) => (
            <li key={item.id} className="relative flex gap-3">
              <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-semibold text-white ring-4 ring-card dark:bg-primary">
                {initials(item.user)}
              </span>
              <div className="min-w-0 pt-0.5 text-sm">
                <p className="leading-snug">
                  <span className="font-medium">{item.user}</span>{' '}
                  <span className="text-muted-foreground">
                    {item.action} {item.subject}
                  </span>{' '}
                  <span className="font-medium">{item.target}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(item.created_at)}</p>
              </div>
            </li>
          ))}
        </ol>
      </QueryState>
    </ChartCard>
  )
}
