import { useState } from 'react'
import { toast } from 'sonner'
import { Download, FileText, Inbox, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import PageHeader from '@/components/admin/layout/PageHeader'
import DataTable from '@/components/admin/tables/DataTable'
import TablePagination from '@/components/admin/tables/TablePagination'
import EmptyState from '@/components/admin/common/EmptyState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'
import { studioApplicationsApi, studioInquiriesApi, studioSubscribersApi } from '@/services/admin/studio'
import { formatDate } from '@/lib/format'

const contact = (row) => (
  <div className="min-w-0">
    <p className="truncate font-medium">{row.full_name ?? row.name}</p>
    <p className="truncate text-xs text-muted-foreground">{row.email}</p>
  </div>
)
const received = { key: 'created_at', header: 'Received', cell: (row) => formatDate(row.created_at), className: 'tabular-nums whitespace-nowrap text-muted-foreground' }

/** Read-only lists of what Game Studio visitors sent in. Rows with more detail open in a dialog. */
const INBOXES = {
  inquiries: {
    title: 'Inquiries',
    description: 'Consultation requests from the Game Studio contact form.',
    api: studioInquiriesApi,
    icon: Inbox,
    columns: [
      { key: 'full_name', header: 'From', cell: contact },
      { key: 'subject', header: 'Subject', cell: (row) => <span className="line-clamp-1">{row.subject || row.message}</span>, className: 'hidden md:table-cell max-w-xs', headerClassName: 'hidden md:table-cell' },
      received,
    ],
    details: (row) => [
      ['Email', <a key="e" href={`mailto:${row.email}`} className="text-primary underline-offset-4 hover:underline">{row.email}</a>],
      ['Phone', row.phone],
      ['Subject', row.subject],
      ['Type of game', row.game_type],
      ['Budget', row.budget],
      ['Message', row.message],
    ],
    dialogTitle: (row) => row.full_name,
  },
  subscribers: {
    title: 'Subscribers',
    description: 'Newsletter sign-ups from the Game Studio website.',
    api: studioSubscribersApi,
    icon: Mail,
    columns: [{ key: 'email', header: 'Email', cell: (row) => <span className="font-medium">{row.email}</span> }, received],
  },
  applications: {
    title: 'Applications',
    description: 'Job applications for Game Studio roles.',
    api: studioApplicationsApi,
    icon: FileText,
    columns: [
      { key: 'name', header: 'Applicant', cell: contact },
      { key: 'job_title', header: 'Role', className: 'hidden md:table-cell', headerClassName: 'hidden md:table-cell' },
      received,
    ],
    details: (row) => [
      ['Role', row.job_title],
      ['Email', <a key="e" href={`mailto:${row.email}`} className="text-primary underline-offset-4 hover:underline">{row.email}</a>],
      ['Phone', row.phone],
      ['Message', row.message],
    ],
    dialogTitle: (row) => row.name,
    canDownload: true,
  },
}

function DetailDialog({ inbox, row, onClose }) {
  const [downloading, setDownloading] = useState(false)
  const download = async () => {
    setDownloading(true)
    try {
      await inbox.api.downloadCv(row)
    } catch (err) {
      toast.error(err.message || 'Could not download the CV')
    } finally {
      setDownloading(false)
    }
  }
  return (
    <Dialog open={!!row} onOpenChange={(open) => !open && onClose()}>
      {row && (
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{inbox.dialogTitle(row)}</DialogTitle>
            <DialogDescription>Received {formatDate(row.created_at)}</DialogDescription>
          </DialogHeader>
          <dl className="grid gap-3 text-sm">
            {inbox.details(row).filter(([, value]) => value).map(([label, value]) => (
              <div key={label} className="grid gap-0.5">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="break-words whitespace-pre-wrap">{value}</dd>
              </div>
            ))}
          </dl>
          {inbox.canDownload && (
            <DialogFooter>
              <Button onClick={download} disabled={downloading}>
                {downloading ? <Loader2 className="animate-spin" /> : <Download />} Download CV
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      )}
    </Dialog>
  )
}

export default function StudioInbox({ type }) {
  const inbox = INBOXES[type]
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [open, setOpen] = useState(null)
  const query = useApiQuery(() => inbox.api.list({ page, per_page: perPage }), [page, perPage])

  return (
    <>
      <PageHeader title={inbox.title} description={inbox.description} />
      <Card className="gap-0 overflow-hidden py-0">
        <DataTable
          columns={inbox.columns}
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          error={query.error}
          onRetry={query.refetch}
          onRowClick={inbox.details ? setOpen : undefined}
          empty={<EmptyState icon={inbox.icon} title={`No ${inbox.title.toLowerCase()} yet`} description="They appear here as soon as visitors send them." />}
        />
        <TablePagination
          meta={query.data?.meta}
          onPageChange={setPage}
          onPerPageChange={(value) => {
            setPerPage(value)
            setPage(1)
          }}
        />
      </Card>
      {inbox.details && <DetailDialog inbox={inbox} row={open} onClose={() => setOpen(null)} />}
    </>
  )
}
