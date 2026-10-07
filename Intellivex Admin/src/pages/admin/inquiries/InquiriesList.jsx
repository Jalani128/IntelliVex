import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { CircleCheck, Inbox, PhoneCall } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import PageHeader from '@/components/admin/layout/PageHeader'
import DataTable from '@/components/admin/tables/DataTable'
import TablePagination from '@/components/admin/tables/TablePagination'
import TableToolbar from '@/components/admin/filters/TableToolbar'
import SearchInput from '@/components/admin/filters/SearchInput'
import FilterSelect from '@/components/admin/filters/FilterSelect'
import StatusBadge, { statusLabel } from '@/components/admin/common/StatusBadge'
import RowActions from '@/components/admin/common/RowActions'
import EmptyState from '@/components/admin/common/EmptyState'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useDebounce } from '@/hooks/useDebounce'
import { inquiriesApi, queryInquiries, INQUIRY_STATUSES } from '@/services/admin/inquiries'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'
import { formatDate, initials } from '@/lib/format'

const READ_OPTIONS = [
  { value: '0', label: 'Unread' },
  { value: '1', label: 'Read' },
]

export default function InquiriesList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [isRead, setIsRead] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [toDelete, setToDelete] = useState(null)
  const debouncedSearch = useDebounce(search)

  // The API returns every inquiry at once: load it once, then search / filter / page in
  // memory and patch the rows in place after updates (CONTACT_INQUIRIES_API.md → React notes).
  const query = useApiQuery(() => inquiriesApi.all(), [])
  const [rows, setRows] = useState(null)
  useEffect(() => {
    if (query.data) setRows(query.data)
  }, [query.data])

  const result = useMemo(
    () => queryInquiries(rows ?? [], { search: debouncedSearch, status, is_read: isRead, page, per_page: perPage }),
    [rows, debouncedSearch, status, isRead, page, perPage],
  )

  // Any filter change starts again from page 1.
  const withReset = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const replaceRow = (updated) => setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))

  const updateStatus = async (row, next) => {
    try {
      const res = await inquiriesApi.setStatus(row.id, next)
      replaceRow(res.data)
      toast.success(`${row.full_name} marked as ${statusLabel(next)}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await inquiriesApi.remove(toDelete.id)
      setRows((prev) => prev.filter((r) => r.id !== toDelete.id))
      toast.success('Inquiry deleted')
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'full_name',
      header: 'Full Name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-primary">
            {initials(row.full_name)}
          </span>
          <div className="min-w-0">
            <p className={cn('truncate', row.is_read ? 'font-medium' : 'font-semibold')}>
              {!row.is_read && <span className="mr-1.5 inline-block size-2 rounded-full bg-primary align-middle" aria-label="Unread" />}
              {row.full_name}
            </p>
            <p className="truncate text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (row) => <span className="whitespace-nowrap">{row.phone}</span>,
      className: 'hidden lg:table-cell',
      headerClassName: 'hidden lg:table-cell',
    },
    {
      key: 'subject',
      header: 'Subject',
      cell: (row) => (
        <div className="max-w-[260px]">
          <p className="truncate">{row.subject}</p>
          <p className="truncate text-xs text-muted-foreground">{row.message}</p>
        </div>
      ),
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
    },
    {
      key: 'received_at',
      header: 'Received',
      cell: (row) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(row.received_at)}</span>,
      className: 'hidden sm:table-cell',
      headerClassName: 'hidden sm:table-cell',
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (row) => (
        <RowActions
          label={`Actions for ${row.full_name}`}
          onView={() => navigate(`/admin/inquiries/${row.id}`)}
          onDelete={() => setToDelete(row)}
          extra={[
            row.status !== 'contacted' && { label: 'Mark contacted', icon: PhoneCall, onSelect: () => updateStatus(row, 'contacted') },
            row.status !== 'closed' && { label: 'Mark closed', icon: CircleCheck, onSelect: () => updateStatus(row, 'closed') },
          ].filter(Boolean)}
        />
      ),
    },
  ]

  const hasFilters = debouncedSearch || status !== 'all' || isRead !== 'all'

  return (
    <>
      <PageHeader title="Inquiries" description="“Get Free Consultation” form submissions from the website contact page." />

      <Card className="gap-0 overflow-hidden py-0">
        <TableToolbar>
          <SearchInput value={search} onChange={withReset(setSearch)} placeholder="Search name, email, phone, subject…" />
          <FilterSelect value={status} onChange={withReset(setStatus)} options={INQUIRY_STATUSES} allLabel="All statuses" label="Status" />
          <FilterSelect value={isRead} onChange={withReset(setIsRead)} options={READ_OPTIONS} allLabel="Read & unread" label="Read state" />
        </TableToolbar>

        <DataTable
          columns={columns}
          data={result.data}
          isLoading={query.isLoading || (!rows && !query.error)}
          error={query.error}
          onRetry={query.refetch}
          skeletonRows={perPage > 10 ? 10 : perPage}
          onRowClick={(row) => navigate(`/admin/inquiries/${row.id}`)}
          empty={
            <EmptyState
              icon={Inbox}
              title={hasFilters ? 'No matching inquiries' : 'No inquiries yet'}
              description={hasFilters ? 'Try a different search or filter.' : 'New contact-form submissions will appear here.'}
            />
          }
        />

        <TablePagination
          meta={rows ? result.meta : undefined}
          onPageChange={setPage}
          onPerPageChange={withReset(setPerPage)}
        />
      </Card>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this inquiry?"
        description={toDelete ? `The inquiry from ${toDelete.full_name} will be removed.` : undefined}
      />
    </>
  )
}
