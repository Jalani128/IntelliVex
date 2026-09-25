import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowRight, CircleCheck, Inbox, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DataTable from '@/components/admin/tables/DataTable'
import StatusBadge from '@/components/admin/common/StatusBadge'
import RowActions from '@/components/admin/common/RowActions'
import EmptyState from '@/components/admin/common/EmptyState'
import { inquiriesApi } from '@/services/admin/inquiries'
import { formatDate, initials } from '@/lib/format'

export default function RecentInquiries({ query, className }) {
  const navigate = useNavigate()

  const updateStatus = async (row, status) => {
    try {
      await inquiriesApi.setStatus(row.id, status)
      toast.success(`${row.name} marked as ${status}`)
      query.refetch()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Contact',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-primary">
            {initials(row.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{row.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'service', header: 'Service', className: 'hidden md:table-cell', headerClassName: 'hidden md:table-cell' },
    {
      key: 'created_at',
      header: 'Received',
      cell: (row) => <span className="text-muted-foreground">{formatDate(row.created_at)}</span>,
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
          label={`Actions for ${row.name}`}
          onView={() => navigate(`/admin/inquiries/${row.id}`)}
          extra={[
            row.status !== 'contacted' && { label: 'Mark contacted', icon: PhoneCall, onSelect: () => updateStatus(row, 'contacted') },
            row.status !== 'closed' && { label: 'Mark closed', icon: CircleCheck, onSelect: () => updateStatus(row, 'closed') },
          ].filter(Boolean)}
        />
      ),
    },
  ]

  return (
    <Card className={`gap-0 overflow-hidden pb-0 ${className ?? ''}`}>
      <CardHeader className="pb-5">
        <CardTitle className="font-display text-base font-medium">Recent inquiries</CardTitle>
        <CardDescription>Latest contact-form submissions from the website</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild className="text-primary">
            <Link to="/admin/inquiries">
              View all <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <DataTable
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        onRowClick={(row) => navigate(`/admin/inquiries/${row.id}`)}
        empty={<EmptyState icon={Inbox} title="No inquiries yet" description="New contact-form submissions will appear here." />}
      />
    </Card>
  )
}
