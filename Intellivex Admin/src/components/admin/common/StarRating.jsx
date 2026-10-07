import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 1–5 star rating. Read-only by default; pass `onChange` to make it a picker
 * (a radio group, so arrow keys and screen readers work).
 */
export default function StarRating({ value = 0, onChange, size = 'size-4', className, id }) {
  const stars = [1, 2, 3, 4, 5]

  if (!onChange) {
    return (
      <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value} out of 5 stars`}>
        {stars.map((n) => (
          <Star key={n} className={cn(size, n <= value ? 'fill-warning text-warning' : 'text-muted-foreground/40')} />
        ))}
      </span>
    )
  }

  return (
    <div id={id} role="radiogroup" aria-label="Rating" className={cn('inline-flex items-center gap-1', className)}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(Math.min(5, (value || 0) + 1))
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(Math.max(1, (value || 1) - 1))
          }}
          className="rounded p-0.5 transition-transform outline-none hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Star className={cn(size, n <= value ? 'fill-warning text-warning' : 'text-muted-foreground/40')} />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground tabular-nums">{value ? `${value} / 5` : 'Not rated'}</span>
    </div>
  )
}
