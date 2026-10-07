import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Mail, Phone, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import PageHeader from '@/components/admin/layout/PageHeader'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import StatusBadge from '@/components/admin/common/StatusBadge'
import ErrorState from '@/components/admin/common/ErrorState'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import { useApiQuery } from '@/hooks/useApiQuery'
import { inquiriesApi, INQUIRY_STATUSES } from '@/services/admin/inquiries'
import { formatDate, timeAgo } from '@/lib/format'

/** One read-only field of the submitted form. */
function Field({ label, children, className }) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1.5 text-sm break-words">{children}</dd>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardContent className="grid gap-5">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid gap-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-28 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function InquiryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const query = useApiQuery(() => inquiriesApi.get(id), [id])
  const inquiry = query.data?.data

  const [status, setStatus] = useState('new')
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    if (!inquiry) return
    setStatus(inquiry.status)
    // Opening an inquiry marks it as read — the API expects the client to send this.
    if (!inquiry.is_read) inquiriesApi.markRead(inquiry.id).catch(() => {})
  }, [inquiry])

  const dirty = inquiry && status !== inquiry.status

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await inquiriesApi.setStatus(inquiry.id, status)
      toast.success('Status updated')
      query.refetch()
    } catch (err) {
      toast.error(err.errors?.status?.[0] ?? err.message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    try {
      await inquiriesApi.remove(inquiry.id)
      toast.success('Inquiry deleted')
      navigate('/admin/inquiries', { replace: true })
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const back = (
    <Button variant="outline" asChild>
      <Link to="/admin/inquiries">
        <ArrowLeft /> Back to inquiries
      </Link>
    </Button>
  )

  if (query.isLoading && !inquiry) {
    return (
      <>
        <PageHeader title="Inquiry" actions={back} />
        <DetailSkeleton />
      </>
    )
  }

  if (query.error) {
    return (
      <>
        <PageHeader title="Inquiry" actions={back} />
        <Card>
          <ErrorState error={query.error} onRetry={query.refetch} />
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={inquiry.full_name}
        description={`Received ${formatDate(inquiry.received_at)} · ${timeAgo(inquiry.received_at)}`}
        actions={
          <>
            {back}
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 /> Delete
            </Button>
          </>
        }
      />

      <div className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="font-display text-base font-medium">Get Free Consultation — submission</CardTitle>
            <StatusBadge status={inquiry.status} />
          </CardHeader>
          <CardContent>
            <dl className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name">{inquiry.full_name}</Field>
              <Field label="Phone">
                <a href={`tel:${inquiry.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                  <Phone className="size-3.5" /> {inquiry.phone}
                </a>
              </Field>
              <Field label="Email">
                <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                  <Mail className="size-3.5" /> {inquiry.email}
                </a>
              </Field>
              <Field label="Subject">{inquiry.subject}</Field>
              <Field label="Message" className="sm:col-span-2">
                <p className="rounded-md border bg-muted/40 p-4 leading-relaxed whitespace-pre-line">{inquiry.message}</p>
              </Field>
            </dl>
          </CardContent>
        </Card>

        <form onSubmit={onSubmit} className="grid gap-4">
          <FormSection title="Follow-up" description="Track where this lead stands.">
            <div className="grid gap-2">
              <Label htmlFor="inquiry-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="inquiry-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INQUIRY_STATUSES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormActions
              isSubmitting={saving}
              submitLabel="Save status"
              onReset={dirty ? () => setStatus(inquiry.status) : undefined}
            />
          </FormSection>
        </form>
      </div>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onDelete}
        title="Delete this inquiry?"
        description={`The inquiry from ${inquiry.full_name} will be removed.`}
      />
    </>
  )
}
