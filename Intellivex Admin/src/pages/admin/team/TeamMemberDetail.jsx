import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, EyeOff, Pencil, Send, Star, StarOff, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import PageHeader from '@/components/admin/layout/PageHeader'
import StatusBadge from '@/components/admin/common/StatusBadge'
import ErrorState from '@/components/admin/common/ErrorState'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import { useApiQuery } from '@/hooks/useApiQuery'
import { teamMembersApi, FEATURED_LIMIT, SOCIAL_FIELDS } from '@/services/admin/team'
import { formatDate } from '@/lib/format'
import MemberAvatar, { apiErrorMessage } from './MemberAvatar'

/** One read-only field. */
function Field({ label, children, className }) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1.5 text-sm break-words">{children}</dd>
    </div>
  )
}

const NONE = <span className="text-muted-foreground">—</span>

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
        <CardContent className="grid justify-items-center gap-4">
          <Skeleton className="size-32 rounded-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

/** /admin/team/:id — read-only view of one team member, with quick publish / feature / delete. */
export default function TeamMemberDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const query = useApiQuery(() => teamMembersApi.get(id), [id])
  const member = query.data?.data
  const [busy, setBusy] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const run = async (action, message) => {
    setBusy(true)
    try {
      await action()
      toast.success(message)
      query.refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const onDelete = async () => {
    try {
      await teamMembersApi.remove(member.id)
      toast.success('Team member deleted')
      navigate('/admin/team', { replace: true })
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const back = (
    <Button variant="outline" asChild>
      <Link to="/admin/team">
        <ArrowLeft /> Back to team
      </Link>
    </Button>
  )

  if (query.isLoading && !member) {
    return (
      <>
        <PageHeader title="Team Member" actions={back} />
        <DetailSkeleton />
      </>
    )
  }

  if (query.error) {
    return (
      <>
        <PageHeader title="Team Member" actions={back} />
        <Card>
          <ErrorState error={query.error} onRetry={query.refetch} />
        </Card>
      </>
    )
  }

  const published = member.status === 'published'
  const onWebsite = published && member.is_featured

  return (
    <>
      <PageHeader
        title={member.name}
        description={member.designation}
        actions={
          <>
            {back}
            <Button asChild>
              <Link to={`/admin/team/${member.id}/edit`}>
                <Pencil /> Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 /> Delete
            </Button>
          </>
        }
      />

      <div className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="font-display text-base font-medium">Details</CardTitle>
            <StatusBadge status={member.status} />
          </CardHeader>
          <CardContent>
            <dl className="grid gap-5 sm:grid-cols-2">
              <Field label="Name">{member.name}</Field>
              <Field label="Designation">{member.designation}</Field>
              <Field label="Slug">
                <code className="text-xs">{member.slug}</code>
              </Field>
              <Field label="Sort Order">
                <span className="tabular-nums">{member.sort_order}</span>
              </Field>
              {SOCIAL_FIELDS.map(({ name, label }) => (
                <Field key={name} label={label} className="sm:col-span-2">
                  {member[name] ? (
                    <a href={member[name]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {member[name]}
                    </a>
                  ) : (
                    NONE
                  )}
                </Field>
              ))}
              <Field label="Created">{formatDate(member.created_at)}</Field>
              <Field label="Last Updated">{formatDate(member.updated_at)}</Field>
            </dl>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6">
          <Card>
            <CardContent className="grid justify-items-center gap-3 text-center">
              <MemberAvatar member={member} className="size-32 text-2xl" />
              <p className="text-xs text-muted-foreground">{member.photo_url ? member.photo_alt || 'No alt text' : 'No photo — the website shows initials'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base font-medium">Website</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-sm text-muted-foreground">
                {onWebsite
                  ? 'Shown in the “Our Leadership” section.'
                  : `Not shown — the website lists published, featured members (up to ${FEATURED_LIMIT}).`}
              </p>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() =>
                  run(
                    () => teamMembersApi.setStatus(member.id, published ? 'draft' : 'published'),
                    published ? 'Moved to draft' : 'Published',
                  )
                }
              >
                {published ? <EyeOff /> : <Send />} {published ? 'Move to draft' : 'Publish'}
              </Button>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() =>
                  run(
                    () => teamMembersApi.update(member.id, { is_featured: !member.is_featured }),
                    member.is_featured ? 'Removed from featured' : 'Featured',
                  )
                }
              >
                {member.is_featured ? <StarOff /> : <Star />} {member.is_featured ? 'Unfeature' : 'Feature'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onDelete}
        title="Delete this team member?"
        description={`“${member.name}” will be removed from the website.`}
      />
    </>
  )
}
