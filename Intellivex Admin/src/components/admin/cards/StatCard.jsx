import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'

function Trend({ change }) {
  const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        change > 0 && 'bg-success/10 text-success',
        change < 0 && 'bg-destructive/10 text-destructive',
        change === 0 && 'bg-muted text-muted-foreground',
      )}
    >
      <Icon className="size-3.5" />
      {change > 0 && '+'}
      {change}%
    </span>
  )
}

/** KPI tile: label, big number, % change vs the previous period. */
export default function StatCard({ label, value, change, icon: Icon, caption = 'vs previous period', isLoading }) {
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
            <Icon className="size-5" strokeWidth={1.8} />
          </span>
        )}
      </div>
      {isLoading ? (
        <>
          <Skeleton className="mt-1 h-9 w-24" />
          <Skeleton className="mt-3 h-5 w-36" />
        </>
      ) : (
        <>
          <p className="-mt-1 font-display text-[32px] leading-10 font-medium tracking-tight">{formatNumber(value)}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Trend change={change} />
            <span>{caption}</span>
          </div>
        </>
      )}
    </Card>
  )
}
