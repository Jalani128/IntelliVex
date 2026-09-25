import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import EmptyState from '../common/EmptyState'
import ErrorState from '../common/ErrorState'

/**
 * Config-driven table used by every admin list.
 *
 * columns: [{ key, header, cell?: (row) => node, className?, headerClassName? }]
 * Without `cell`, the column renders `row[key]`.
 */
export default function DataTable({
  columns,
  data = [],
  isLoading = false,
  error,
  onRetry,
  skeletonRows = 5,
  empty,
  rowKey = 'id',
  onRowClick,
  className,
}) {
  const showSkeleton = isLoading && data.length === 0

  return (
    <div className={cn('scrollbar-thin relative overflow-x-auto', className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  'h-11 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase first:pl-6 last:pr-6',
                  col.headerClassName,
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className={cn(isLoading && data.length > 0 && 'opacity-60 transition-opacity')}>
          {showSkeleton &&
            Array.from({ length: skeletonRows }, (_, i) => (
              <TableRow key={`s-${i}`} className="hover:bg-transparent">
                {columns.map((col) => (
                  <TableCell key={col.key} className="px-4 py-4 first:pl-6 last:pr-6">
                    <Skeleton className="h-4 w-full max-w-[160px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!showSkeleton && error && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length}>
                <ErrorState error={error} onRetry={onRetry} />
              </TableCell>
            </TableRow>
          )}

          {!showSkeleton && !error && data.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length}>{empty ?? <EmptyState title="No records found" />}</TableCell>
            </TableRow>
          )}

          {!error &&
            data.map((row) => (
              <TableRow
                key={row[rowKey]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(onRowClick && 'cursor-pointer')}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={cn('px-4 py-3.5 first:pl-6 last:pr-6', col.className)}>
                    {col.cell ? col.cell(row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
