import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const PER_PAGE_OPTIONS = [10, 20, 50]

/** Page numbers with ellipses: 1 … 4 5 6 … 12 */
function pageWindow(current, last) {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  const pages = new Set([1, last, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['…', p] : [p]))
}

/**
 * Footer pagination driven by Laravel-style `meta`
 * ({ current_page, per_page, total, last_page }).
 */
export default function TablePagination({ meta, onPageChange, onPerPageChange, className }) {
  if (!meta || meta.total === 0) return null
  const { current_page: page, per_page: perPage, total, last_page: last } = meta
  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <div className={cn('flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Showing <span className="font-medium text-foreground">{from}</span>–<span className="font-medium text-foreground">{to}</span> of{' '}
          <span className="font-medium text-foreground">{total}</span>
        </span>
        {onPerPageChange && (
          <Select value={String(perPage)} onValueChange={(v) => onPerPageChange(Number(v))}>
            <SelectTrigger size="sm" className="w-[76px]" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeft />
        </Button>
        {pageWindow(page, last).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="px-1.5 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'ghost'}
              size="icon-sm"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </Button>
          ),
        )}
        <Button variant="outline" size="icon-sm" disabled={page >= last} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <ChevronRight />
        </Button>
      </nav>
    </div>
  )
}
