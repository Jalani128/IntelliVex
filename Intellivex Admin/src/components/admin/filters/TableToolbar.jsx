import { cn } from '@/lib/utils'

/** Row above a table: search/filters on the left, extra actions on the right. */
export default function TableToolbar({ children, actions, className }) {
  return (
    <div className={cn('flex flex-col gap-3 border-b px-6 py-4 lg:flex-row lg:items-center lg:justify-between', className)}>
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
