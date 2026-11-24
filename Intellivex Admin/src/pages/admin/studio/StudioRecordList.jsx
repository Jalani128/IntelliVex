import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { EyeOff, Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import PageHeader from '@/components/admin/layout/PageHeader'
import DataTable from '@/components/admin/tables/DataTable'
import TablePagination from '@/components/admin/tables/TablePagination'
import TableToolbar from '@/components/admin/filters/TableToolbar'
import SearchInput from '@/components/admin/filters/SearchInput'
import StatusBadge from '@/components/admin/common/StatusBadge'
import RowActions from '@/components/admin/common/RowActions'
import EmptyState from '@/components/admin/common/EmptyState'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useDebounce } from '@/hooks/useDebounce'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'
import { STUDIO_RECORDS } from './records'

/** List page for one Game Studio record type (games, news, roles, people); `type` is a key of STUDIO_RECORDS. */
export default function StudioRecordList({ type }) {
  const config = STUDIO_RECORDS[type]
  const { api, path, title, singular, description, icon, label, subtitle, thumb, dateColumn, sortable, searchable } = config
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [toDelete, setToDelete] = useState(null)
  const debouncedSearch = useDebounce(search)

  const query = useApiQuery(
    () => api.list({ search: searchable ? debouncedSearch : undefined, page, per_page: perPage, sort: sortable ? 'sort_order' : undefined }),
    [debouncedSearch, page, perPage],
  )

  const toggleStatus = async (row) => {
    const next = row.status === 'published' ? 'draft' : 'published'
    try {
      await api.update(row.id, { status: next })
      toast.success(`${label(row)} ${next === 'published' ? 'published' : 'moved to draft'}`)
      query.refetch()
    } catch (err) {
      toast.error(err.errors ? Object.values(err.errors)[0]?.[0] : err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await api.remove(toDelete.id)
      toast.success(`${singular} deleted`)
      query.refetch()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'name',
      header: singular,
      cell: (row) => (
        <div className="flex items-center gap-3">
          {thumb && (
            <div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted">
              {row.image_url && <img src={row.image_url} alt="" className={thumb === 'logo' ? 'size-full object-contain p-1' : 'size-full object-cover'} />}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium">{label(row)}</p>
            {subtitle?.(row) && <p className="truncate text-xs text-muted-foreground">{subtitle(row)}</p>}
          </div>
        </div>
      ),
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    dateColumn && {
      key: dateColumn.key,
      header: dateColumn.header,
      cell: (row) => row[dateColumn.key]?.slice(0, 10) || '—',
      className: 'hidden sm:table-cell tabular-nums text-muted-foreground',
      headerClassName: 'hidden sm:table-cell',
    },
    sortable && { key: 'sort_order', header: 'Order', className: 'hidden sm:table-cell tabular-nums', headerClassName: 'hidden sm:table-cell' },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (row) => (
        <RowActions
          label={`Actions for ${label(row)}`}
          onEdit={() => navigate(`${path}/${row.id}/edit`)}
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
  ].filter(Boolean)

  return (
    <>
      <PageHeader title={title} description={description} />
      <Card className="gap-0 overflow-hidden py-0">
        <TableToolbar
          actions={
            <Button asChild>
              <Link to={`${path}/create`}>
                <Plus /> Add {singular}
              </Link>
            </Button>
          }
        >
          {searchable && (
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value)
                setPage(1)
              }}
              placeholder={`Search ${title.toLowerCase()}…`}
            />
          )}
        </TableToolbar>

        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          error={query.error}
          onRetry={query.refetch}
          onRowClick={(row) => navigate(`${path}/${row.id}/edit`)}
          empty={
            <EmptyState
              icon={icon}
              title={debouncedSearch ? `No matching ${title.toLowerCase()}` : `No ${title.toLowerCase()} yet`}
              description={debouncedSearch ? 'Try a different search.' : `Add one to show it on the Game Studio website.`}
            />
          }
        />

        <TablePagination
          meta={query.data?.meta}
          onPageChange={setPage}
          onPerPageChange={(value) => {
            setPerPage(value)
            setPage(1)
          }}
        />

        <ConfirmDeleteDialog
          open={!!toDelete}
          onOpenChange={(open) => !open && setToDelete(null)}
          onConfirm={confirmDelete}
          title={`Delete this ${singular.toLowerCase()}?`}
          description={toDelete ? `“${label(toDelete)}” will be removed from the Game Studio website.` : undefined}
        />
      </Card>
    </>
  )
}
