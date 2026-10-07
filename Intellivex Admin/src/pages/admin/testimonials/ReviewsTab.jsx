import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { EyeOff, House, MessageSquareQuote, Plus, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import DataTable from '@/components/admin/tables/DataTable'
import TablePagination from '@/components/admin/tables/TablePagination'
import TableToolbar from '@/components/admin/filters/TableToolbar'
import SearchInput from '@/components/admin/filters/SearchInput'
import FilterSelect from '@/components/admin/filters/FilterSelect'
import StatusBadge from '@/components/admin/common/StatusBadge'
import StarRating from '@/components/admin/common/StarRating'
import RowActions from '@/components/admin/common/RowActions'
import EmptyState from '@/components/admin/common/EmptyState'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useDebounce } from '@/hooks/useDebounce'
import { reviewsApi, reviewRole, LIMITS, PUBLISH_STATUSES } from '@/services/admin/testimonials'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'
import { initials } from '@/lib/format'

const HOME_OPTIONS = [
  { value: '1', label: 'On Home page' },
  { value: '0', label: 'Not on Home' },
]

export default function ReviewsTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  // `?status=published` (from the dashboard) preselects the filter.
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState(() => searchParams.get('status') ?? 'all')
  const [home, setHome] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [toDelete, setToDelete] = useState(null)
  const debouncedSearch = useDebounce(search)

  const query = useApiQuery(
    () => reviewsApi.list({ search: debouncedSearch, status, show_on_home: home, page, per_page: perPage, sort: 'sort_order' }),
    [debouncedSearch, status, home, page, perPage],
  )
  const onHome = useApiQuery(() => reviewsApi.list({ status: 'published', show_on_home: 1, per_page: 50 }), [])
  const homeCount = onHome.data?.meta.total ?? 0

  const withReset = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const refresh = () => {
    query.refetch()
    onHome.refetch()
  }

  const update = async (row, patch, message) => {
    try {
      await reviewsApi.update(row.id, patch)
      toast.success(message)
      refresh()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await reviewsApi.remove(toDelete.id)
      toast.success('Review deleted')
      refresh()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'client_name',
      header: 'Client',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-accent text-xs font-semibold text-primary">
            {row.avatar_url ? <img src={row.avatar_url} alt="" className="size-full object-cover" /> : initials(row.client_name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{row.client_name}</p>
            <p className="truncate text-xs text-muted-foreground">{reviewRole(row)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'quote',
      header: 'Review',
      cell: (row) => <p className="max-w-[280px] truncate text-muted-foreground">“{row.quote}”</p>,
      className: 'hidden xl:table-cell',
      headerClassName: 'hidden xl:table-cell',
    },
    { key: 'rating', header: 'Rating', cell: (row) => <StarRating value={row.rating} size="size-3.5" />, className: 'hidden sm:table-cell', headerClassName: 'hidden sm:table-cell' },
    {
      key: 'show_on_home',
      header: 'Home',
      cell: (row) => (row.show_on_home ? <House className="size-4 text-primary" aria-label="On Home page" /> : <span className="text-muted-foreground">–</span>),
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (row) => (
        <RowActions
          label={`Actions for ${row.client_name}`}
          onEdit={() => navigate(`/admin/testimonials/${row.id}/edit`)}
          onDelete={() => setToDelete(row)}
          extra={[
            {
              label: row.status === 'published' ? 'Move to draft' : 'Publish',
              icon: row.status === 'published' ? EyeOff : Send,
              onSelect: () =>
                update(row, { status: row.status === 'published' ? 'draft' : 'published' }, `Review by ${row.client_name} updated`),
            },
            {
              label: row.show_on_home ? 'Remove from Home' : 'Show on Home',
              icon: House,
              onSelect: () =>
                update(row, { show_on_home: !row.show_on_home }, `${row.client_name} ${row.show_on_home ? 'removed from' : 'added to'} Home page`),
            },
          ]}
        />
      ),
    },
  ]

  const hasFilters = debouncedSearch || status !== 'all' || home !== 'all'

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar
        actions={
          <Button asChild>
            <Link to="/admin/testimonials/create">
              <Plus /> Add Review
            </Link>
          </Button>
        }
      >
        <SearchInput value={search} onChange={withReset(setSearch)} placeholder="Search name, company, review…" />
        <FilterSelect value={status} onChange={withReset(setStatus)} options={PUBLISH_STATUSES} allLabel="All statuses" label="Status" />
        <FilterSelect value={home} onChange={withReset(setHome)} options={HOME_OPTIONS} allLabel="Home: any" label="Home page" />
      </TableToolbar>

      {onHome.data && (
        <div className="border-b bg-muted/30 px-6 py-2.5">
          <span className={cn('text-xs', homeCount > LIMITS.home ? 'font-medium text-warning' : 'text-muted-foreground')}>
            Home page “Real Reviews”: <span className="tabular-nums">{homeCount} / {LIMITS.home}</span>
            {homeCount > LIMITS.home && ` — only the first ${LIMITS.home} show`}
          </span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        onRowClick={(row) => navigate(`/admin/testimonials/${row.id}/edit`)}
        empty={
          <EmptyState
            icon={MessageSquareQuote}
            title={hasFilters ? 'No matching reviews' : 'No reviews yet'}
            description={hasFilters ? 'Try a different search or filter.' : 'Add client reviews to show them on the website.'}
          />
        }
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} onPerPageChange={withReset(setPerPage)} />

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this review?"
        description={toDelete ? `The review by ${toDelete.client_name} will be removed from the website.` : undefined}
      />
    </Card>
  )
}
