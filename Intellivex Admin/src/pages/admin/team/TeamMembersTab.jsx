import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { EyeOff, Plus, Send, Star, StarOff, Users } from 'lucide-react'
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
import { teamMembersApi, FEATURED_LIMIT, TEAM_STATUSES } from '@/services/admin/team'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'
import MemberAvatar, { apiErrorMessage } from './MemberAvatar'

const FEATURED_OPTIONS = [
  { value: '1', label: 'Featured' },
  { value: '0', label: 'Not featured' },
]

export default function TeamMembersTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [featured, setFeatured] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [toDelete, setToDelete] = useState(null)
  const debouncedSearch = useDebounce(search)

  const query = useApiQuery(
    () => teamMembersApi.list({ search: debouncedSearch, status, is_featured: featured, page, per_page: perPage, sort: 'sort_order' }),
    [debouncedSearch, status, featured, page, perPage],
  )

  // Published + featured members are the ones the website shows (max 3).
  const live = useApiQuery(() => teamMembersApi.list({ status: 'published', is_featured: 1, per_page: FEATURED_LIMIT + 1 }), [])
  const liveCount = live.data?.meta.total ?? 0

  const withReset = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const refresh = () => {
    query.refetch()
    live.refetch()
  }

  const run = async (action, message) => {
    try {
      await action()
      toast.success(message)
      refresh()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  const toggleStatus = (row) => {
    const next = row.status === 'published' ? 'draft' : 'published'
    run(() => teamMembersApi.setStatus(row.id, next), `${row.name} ${next === 'published' ? 'published' : 'moved to draft'}`)
  }

  const toggleFeatured = (row) =>
    run(
      () => teamMembersApi.update(row.id, { is_featured: !row.is_featured }),
      `${row.name} ${row.is_featured ? 'removed from' : 'added to'} the website’s leadership row`,
    )

  const confirmDelete = async () => {
    try {
      await teamMembersApi.remove(toDelete.id)
      toast.success('Team member deleted')
      refresh()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Member',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <MemberAvatar member={row} />
          <div className="min-w-0">
            <p className="truncate font-medium">{row.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.designation}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'is_featured',
      header: 'Featured',
      cell: (row) =>
        row.is_featured ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary">
            <Star className="size-3 fill-current" /> Featured
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
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
          onView={() => navigate(`/admin/team/${row.id}`)}
          onEdit={() => navigate(`/admin/team/${row.id}/edit`)}
          onDelete={() => setToDelete(row)}
          extra={[
            {
              label: row.is_featured ? 'Unfeature' : 'Feature',
              icon: row.is_featured ? StarOff : Star,
              onSelect: () => toggleFeatured(row),
            },
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
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar
        actions={
          <Button asChild>
            <Link to="/admin/team/create">
              <Plus /> Add Team Member
            </Link>
          </Button>
        }
      >
        <SearchInput value={search} onChange={withReset(setSearch)} placeholder="Search team…" />
        <FilterSelect value={status} onChange={withReset(setStatus)} options={TEAM_STATUSES} allLabel="All statuses" label="Status" />
        <FilterSelect value={featured} onChange={withReset(setFeatured)} options={FEATURED_OPTIONS} allLabel="All members" label="Featured" />
      </TableToolbar>

      {live.data && (
        <div className="border-b bg-muted/30 px-6 py-2.5">
          <span className={cn('text-xs', liveCount >= FEATURED_LIMIT ? 'font-medium text-primary' : 'text-muted-foreground')}>
            On the website (published + featured): <span className="tabular-nums">{liveCount} / {FEATURED_LIMIT}</span>
            {liveCount >= FEATURED_LIMIT && ' — unfeature or unpublish one to feature another'}
          </span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        onRowClick={(row) => navigate(`/admin/team/${row.id}`)}
        empty={
          <EmptyState
            icon={Users}
            title={hasFilters ? 'No matching team members' : 'No team members yet'}
            description={hasFilters ? 'Try a different search or filter.' : 'Add team members to show them in the website’s “Our Leadership” section.'}
          />
        }
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} onPerPageChange={withReset(setPerPage)} />

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this team member?"
        description={toDelete ? `“${toDelete.name}” will be removed from the website.` : undefined}
      />
    </Card>
  )
}
