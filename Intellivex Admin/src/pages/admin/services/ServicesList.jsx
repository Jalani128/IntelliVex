import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Check, EyeOff, Layers, Plus, Send } from 'lucide-react'
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
import { servicesApi, serviceName, SERVICE_STATUSES } from '@/services/admin/services'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'
import { formatDate } from '@/lib/format'
import { cn, SITE_NAVY_BG } from '@/lib/utils'

const FEATURED_OPTIONS = [
  { value: '1', label: 'Featured' },
  { value: '0', label: 'Not featured' },
]

/** Small ✓ / – cell for boolean flags. */
function Flag({ on, label }) {
  return on ? (
    <Check className="size-4 text-success" aria-label={label} />
  ) : (
    <span className="text-muted-foreground" aria-label={`Not ${label.toLowerCase()}`}>
      –
    </span>
  )
}

/** Services tab of /admin/services (the page header with "Add Service" sits in ServicesPage). */
export default function ServicesList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  // `?status=published` (from the dashboard) preselects the filter.
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState(() => searchParams.get('status') ?? 'all')
  const [featured, setFeatured] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [toDelete, setToDelete] = useState(null)
  const debouncedSearch = useDebounce(search)

  const query = useApiQuery(
    () =>
      servicesApi.list({
        search: debouncedSearch,
        status,
        is_featured: featured,
        page,
        per_page: perPage,
        sort: 'sort_order',
      }),
    [debouncedSearch, status, featured, page, perPage],
  )

  // Parent names for the "Parent" column (sub-services such as Data Science).
  const allServices = useApiQuery(() => servicesApi.list({ per_page: 100 }), [])
  const nameById = useMemo(
    () => Object.fromEntries((allServices.data?.data ?? []).map((s) => [s.id, serviceName(s)])),
    [allServices.data],
  )

  const withReset = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const toggleStatus = async (row) => {
    const next = row.status === 'published' ? 'draft' : 'published'
    try {
      await servicesApi.setStatus(row.id, next)
      toast.success(`${serviceName(row)} ${next === 'published' ? 'published' : 'moved to draft'}`)
      query.refetch()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await servicesApi.remove(toDelete.id)
      toast.success('Service deleted')
      query.refetch()
      allServices.refetch()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Service',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className={cn('grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border text-primary', row.icon_url ? SITE_NAVY_BG : 'bg-accent')}>
            {row.icon_url ? <img src={row.icon_url} alt="" className="size-full object-contain p-1.5" /> : <Layers className="size-4" />}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">
              {row.title} {row.highlight && <span className="text-primary">{row.highlight}</span>}
            </p>
            <p className="truncate text-xs text-muted-foreground">/services/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'parent_id',
      header: 'Parent',
      cell: (row) => <span className="text-muted-foreground">{row.parent_id ? (nameById[row.parent_id] ?? '—') : '—'}</span>,
      className: 'hidden lg:table-cell',
      headerClassName: 'hidden lg:table-cell',
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'is_featured',
      header: 'Home',
      cell: (row) => <Flag on={row.is_featured} label="Featured" />,
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
    },
    {
      key: 'show_in_menu',
      header: 'Menu',
      cell: (row) => <Flag on={row.show_in_menu} label="In menu" />,
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
    },
    {
      key: 'sort_order',
      header: 'Order',
      className: 'hidden sm:table-cell tabular-nums',
      headerClassName: 'hidden sm:table-cell',
    },
    {
      key: 'updated_at',
      header: 'Updated',
      cell: (row) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(row.updated_at)}</span>,
      className: 'hidden xl:table-cell',
      headerClassName: 'hidden xl:table-cell',
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (row) => (
        <RowActions
          label={`Actions for ${serviceName(row)}`}
          onEdit={() => navigate(`/admin/services/${row.id}/edit`)}
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

  const hasFilters = debouncedSearch || status !== 'all' || featured !== 'all'

  return (
    <>
      <Card className="gap-0 overflow-hidden py-0">
        <TableToolbar>
          <SearchInput value={search} onChange={withReset(setSearch)} placeholder="Search title or slug…" />
          <FilterSelect value={status} onChange={withReset(setStatus)} options={SERVICE_STATUSES} allLabel="All statuses" label="Status" />
          <FilterSelect value={featured} onChange={withReset(setFeatured)} options={FEATURED_OPTIONS} allLabel="Home: any" label="Featured" />
        </TableToolbar>

        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          error={query.error}
          onRetry={query.refetch}
          onRowClick={(row) => navigate(`/admin/services/${row.id}/edit`)}
          empty={
            <EmptyState
              icon={Layers}
              title={hasFilters ? 'No matching services' : 'No services yet'}
              description={hasFilters ? 'Try a different search or filter.' : 'Add your first service to show it on the website.'}
              action={
                !hasFilters && (
                  <Button asChild size="sm">
                    <Link to="/admin/services/create">
                      <Plus /> Add Service
                    </Link>
                  </Button>
                )
              }
            />
          }
        />

        <TablePagination meta={query.data?.meta} onPageChange={setPage} onPerPageChange={withReset(setPerPage)} />
      </Card>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this service?"
        description={
          toDelete
            ? `“${serviceName(toDelete)}” will be removed from the website. Its benefits and FAQs are deleted with it.`
            : undefined
        }
      />
    </>
  )
}
