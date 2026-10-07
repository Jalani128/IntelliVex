import { Link } from 'react-router-dom'
import { ArrowUpRight, Minus, TrendingDown, TrendingUp } from 'lucide-react'
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

/**
 * KPI tile: label, big number, % change vs the previous period. `null` value → “—”, `null` change → no trend chip.
 * With `to`, the whole tile links there.
 */
export default function StatCard({ label, value, change, icon: Icon, caption = 'vs previous period', isLoading, to }) {
  const card = (
    <Card className={cn('gap-0 p-5', to && 'h-full transition-colors group-hover:border-primary/40 group-hover:bg-accent/30')}>
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
          <p className="-mt-1 font-display text-[32px] leading-10 font-medium tracking-tight">{value == null ? '—' : formatNumber(value)}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            {change != null && <Trend change={change} />}
            <span>{caption}</span>
            {to && <ArrowUpRight className="ml-auto size-4 opacity-0 transition-opacity group-hover:opacity-100" />}
          </div>
        </>
      )}
    </Card>
  )

  if (!to) return card
  return (
    <Link to={to} aria-label={`${label}: open list`} className="group block rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
      {card}
    </Link>
  )
}
