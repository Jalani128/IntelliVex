import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { EyeOff, Handshake, Plus, Send } from 'lucide-react'
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
import { partnersApi, LIMITS, PARTNER_TYPES, PUBLISH_STATUSES } from '@/services/admin/partnerships'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'

const PLACEMENTS = [
  { value: 'strategic', label: 'Strategic row' },
  { value: 'integration', label: 'Integration grid' },
]

const typeLabel = (value) => PARTNER_TYPES.find((t) => t.value === value)?.label ?? value

function Placement({ on, children }) {
  if (!on) return null
  return <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary">{children}</span>
}

/** "Strategic row 4 / 4" — how many published logos each website section will show. */
function SlotCount({ label, count, max }) {
  return (
    <span className={cn('text-xs', count > max ? 'font-medium text-warning' : 'text-muted-foreground')}>
      {label}: <span className="tabular-nums">{count} / {max}</span>
      {count > max && ' — only the first ' + max + ' show'}
    </span>
  )
}

export default function PartnersTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [placement, setPlacement] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [toDelete, setToDelete] = useState(null)
  const debouncedSearch = useDebounce(search)

  const query = useApiQuery(
    () =>
      partnersApi.list({
        search: debouncedSearch,
        status,
        show_as_strategic: placement === 'strategic' ? 1 : undefined,
        show_as_integration: placement === 'integration' ? 1 : undefined,
        page,
        per_page: perPage,
        sort: 'sort_order',
      }),
    [debouncedSearch, status, placement, page, perPage],
  )

  // Published logos per section, for the slot counters above the table.
  const published = useApiQuery(() => partnersApi.list({ status: 'published', per_page: 200 }), [])
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
      await partnersApi.setStatus(row.id, next)
      toast.success(`${row.name} ${next === 'published' ? 'published' : 'moved to draft'}`)
      refresh()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await partnersApi.remove(toDelete.id)
      toast.success('Partner deleted')
      refresh()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Partner',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted text-muted-foreground">
            {row.logo_url ? <img src={row.logo_url} alt="" className="size-full object-contain p-1.5" /> : <Handshake className="size-4" />}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{row.name}</p>
            <p className="truncate text-xs text-muted-foreground">{typeLabel(row.type)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'placement',
      header: 'Shown in',
      cell: (row) =>
        row.show_as_strategic || row.show_as_integration ? (
          <div className="flex flex-wrap gap-1.5">
            <Placement on={row.show_as_strategic}>Strategic row</Placement>
            <Placement on={row.show_as_integration}>Integration grid</Placement>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Not shown</span>
        ),
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'sort_order',
      header: 'Order',
      className: 'hidden sm:table-cell tabular-nums',
      headerClassName: 'hidden sm:table-cell',
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (row) => (
        <RowActions
          label={`Actions for ${row.name}`}
          onEdit={() => navigate(`/admin/partnerships/${row.id}/edit`)}
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

  const hasFilters = debouncedSearch || status !== 'all' || placement !== 'all'

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar
        actions={
          <Button asChild>
            <Link to="/admin/partnerships/create">
              <Plus /> Add Partner
            </Link>
          </Button>
        }
      >
        <SearchInput value={search} onChange={withReset(setSearch)} placeholder="Search partners…" />
        <FilterSelect value={status} onChange={withReset(setStatus)} options={PUBLISH_STATUSES} allLabel="All statuses" label="Status" />
        <FilterSelect value={placement} onChange={withReset(setPlacement)} options={PLACEMENTS} allLabel="All sections" label="Shown in" />
      </TableToolbar>

      {published.data && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-b bg-muted/30 px-6 py-2.5">
          <SlotCount label="Strategic row" count={live.filter((p) => p.show_as_strategic).length} max={LIMITS.strategic} />
          <SlotCount label="Integration grid" count={live.filter((p) => p.show_as_integration).length} max={LIMITS.integration} />
        </div>
      )}

      <DataTable
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        onRowClick={(row) => navigate(`/admin/partnerships/${row.id}/edit`)}
        empty={
          <EmptyState
            icon={Handshake}
            title={hasFilters ? 'No matching partners' : 'No partners yet'}
            description={hasFilters ? 'Try a different search or filter.' : 'Add partner logos to show them on the Partnerships page.'}
          />
        }
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} onPerPageChange={withReset(setPerPage)} />

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this partner?"
        description={toDelete ? `“${toDelete.name}” and its logo will be removed from the website.` : undefined}
      />
    </Card>
  )
}
