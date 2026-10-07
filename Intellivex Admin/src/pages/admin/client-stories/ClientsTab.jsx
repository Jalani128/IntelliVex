import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Building, EyeOff, Plus, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import DataTable from '@/components/admin/tables/DataTable'
import TablePagination from '@/components/admin/tables/TablePagination'
import TableToolbar from '@/components/admin/filters/TableToolbar'
import SearchInput from '@/components/admin/filters/SearchInput'
import FilterSelect from '@/components/admin/filters/FilterSelect'
import StatusBadge from '@/components/admin/common/StatusBadge'
import RowActions from '@/components/admin/common/RowActions'
import EmptyState from '@/components/admin/common/EmptyState'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useDebounce } from '@/hooks/useDebounce'
import { clientsApi, clientSiteUrl, LIMITS, PUBLISH_STATUSES } from '@/services/admin/testimonials'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'

function SlotCount({ label, count, max }) {
  return (
    <span className={cn('text-xs', count > max ? 'font-medium text-warning' : 'text-muted-foreground')}>
      {label}: <span className="tabular-nums">{count} / {max}</span>
      {count > max && ` — only the first ${max} show`}
    </span>
  )
}

/** Clients list. Create / edit open the full-page form at /admin/client-stories/create and /:id/edit. */
export default function ClientsTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [toDelete, setToDelete] = useState(null)
  const debouncedSearch = useDebounce(search)

  // The API filters clients by `search` and `status` only.
  const query = useApiQuery(
    () => clientsApi.list({ search: debouncedSearch, status, page, per_page: perPage, sort: 'sort_order' }),
    [debouncedSearch, status, page, perPage],
  )
  const published = useApiQuery(() => clientsApi.list({ status: 'published', per_page: 100 }), [])
  const live = published.data?.data ?? []

  const withReset = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const refresh = () => {
    query.refetch()
    published.refetch()
  }

  const toggleStatus = async (row) => {
    const next = row.status === 'published' ? 'draft' : 'published'
    try {
      await clientsApi.setStatus(row.id, next)
      toast.success(`${row.name} ${next === 'published' ? 'published' : 'moved to draft'}`)
      refresh()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await clientsApi.remove(toDelete.id)
      toast.success('Client deleted')
      refresh()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Client',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted text-muted-foreground">
            {row.logo_url ? <img src={row.logo_url} alt="" className="size-full object-contain p-1.5" /> : <Building className="size-4" />}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{row.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.industry && <span className="font-medium text-primary">{row.industry} · </span>}
              /client-portfolio/{row.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'placement',
      header: 'Shown in',
      cell: (row) =>
        row.show_in_logo_bar || row.show_in_portfolio ? (
          <div className="flex flex-wrap gap-1.5">
            {row.show_in_logo_bar && <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-primary">Logo bar</span>}
            {row.show_in_portfolio && <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-primary">Client Portfolio</span>}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Not shown</span>
        ),
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { key: 'sort_order', header: 'Order', className: 'hidden sm:table-cell tabular-nums', headerClassName: 'hidden sm:table-cell' },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (row) => (
        <RowActions
          label={`Actions for ${row.name}`}
          // The public detail page only exists for published Client Portfolio clients.
          onView={
            row.status === 'published' && row.show_in_portfolio && clientSiteUrl(row)
              ? () => window.open(clientSiteUrl(row), '_blank', 'noopener')
              : undefined
          }
          onEdit={() => navigate(`/admin/client-stories/${row.id}/edit`)}
          onDelete={() => setToDelete(row)}
          extra={[
            {
              label: row.status === 'published' ? 'Move to draft' : 'Publish',
              icon: row.status === 'published' ? EyeOff : Send,
              onSelect: () => toggleStatus(row),
            },
          ]}
        />
      ),
    },
  ]

  const hasFilters = debouncedSearch || status !== 'all'

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar
        actions={
          <Button asChild>
            <Link to="/admin/client-stories/create">
              <Plus /> Add Client
            </Link>
          </Button>
        }
      >
        <SearchInput value={search} onChange={withReset(setSearch)} placeholder="Search clients…" />
        <FilterSelect value={status} onChange={withReset(setStatus)} options={PUBLISH_STATUSES} allLabel="All statuses" label="Status" />
      </TableToolbar>

      {published.data && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-b bg-muted/30 px-6 py-2.5">
          <SlotCount label="Logo bar" count={live.filter((c) => c.show_in_logo_bar).length} max={LIMITS.logoBar} />
          <SlotCount label="Client Portfolio" count={live.filter((c) => c.show_in_portfolio).length} max={LIMITS.portfolio} />
        </div>
      )}

      <DataTable
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        onRowClick={(row) => navigate(`/admin/client-stories/${row.id}/edit`)}
        empty={
          <EmptyState
            icon={Building}
            title={hasFilters ? 'No matching clients' : 'No clients yet'}
            description={hasFilters ? 'Try a different search or filter.' : 'Add clients for the logo bar and the Client Portfolio pages.'}
            action={
              !hasFilters && (
                <Button asChild size="sm">
                  <Link to="/admin/client-stories/create">
                    <Plus /> Add Client
                  </Link>
                </Button>
              )
            }
          />
        }
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} onPerPageChange={withReset(setPerPage)} />

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this client?"
        description={toDelete ? `“${toDelete.name}” will be removed from the website. Linked reviews and success stories stay but lose the link.` : undefined}
      />
    </Card>
  )
}
