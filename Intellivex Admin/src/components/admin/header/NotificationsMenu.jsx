import { Link } from 'react-router-dom'
import { Bell, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { inquiriesApi } from '@/services/admin/inquiries'
import { timeAgo } from '@/lib/format'

/** Bell menu listing unhandled (status = new) contact inquiries. */
export default function NotificationsMenu() {
  const query = useApiQuery(() => inquiriesApi.list({ status: 'new', per_page: 5 }))
  const items = query.data?.data ?? []
  const total = query.data?.meta.total ?? 0

  return (
    <DropdownMenu onOpenChange={(open) => open && query.refetch()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={total ? `Notifications (${total} new)` : 'Notifications'}>
          <Bell className="size-[18px]" />
          {total > 0 && (
            <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] leading-4 font-semibold text-primary-foreground">
              {total > 9 ? '9+' : total}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
          <span className="font-display text-[15px] font-medium">Notifications</span>
          {total > 0 && <span className="text-xs font-normal text-muted-foreground">{total} new inquiries</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />
        <div className="scrollbar-thin max-h-80 overflow-y-auto p-1">
          {query.isLoading && !query.data
            ? Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex gap-3 px-3 py-2.5">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))
            : items.map((inq) => (
                <DropdownMenuItem key={inq.id} asChild className="items-start gap-3 px-3 py-2.5">
                  <Link to={`/admin/inquiries/${inq.id}`}>
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent text-primary">
                      <Inbox className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">
                        <span className="font-medium">{inq.full_name}</span> — {inq.subject}
                      </span>
                      <span className="text-xs text-muted-foreground">{timeAgo(inq.received_at)}</span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
          {!query.isLoading && items.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">You&rsquo;re all caught up.</p>
          )}
        </div>
        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuItem asChild className="justify-center rounded-none py-2.5 text-sm font-medium text-primary">
          <Link to="/admin/inquiries">View all inquiries</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
