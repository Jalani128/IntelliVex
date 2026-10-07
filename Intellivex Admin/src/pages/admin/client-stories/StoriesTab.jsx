import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { EyeOff, ImageIcon, Plus, Send, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import DataTable from '@/components/admin/tables/DataTable'
import TableToolbar from '@/components/admin/filters/TableToolbar'
import FilterSelect from '@/components/admin/filters/FilterSelect'
import StatusBadge from '@/components/admin/common/StatusBadge'
import RowActions from '@/components/admin/common/RowActions'
import EmptyState from '@/components/admin/common/EmptyState'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import FormSheet from '@/components/admin/modals/FormSheet'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import { SelectField, SortOrderField, SwitchField, TextField, nullableImageField } from '@/components/admin/forms/FormFields'
import { useApiQuery } from '@/hooks/useApiQuery'
import { clientsApi, successStoriesApi, IMAGE_MB, LIMITS, PUBLISH_STATUSES } from '@/services/admin/testimonials'
import { projectsApi } from '@/services/admin/projects'

const NONE = 'none'
const PHOTO = IMAGE_TYPES.photo
const ROW_OPTIONS = [
  { value: '1', label: 'Featured (large)' },
  { value: '0', label: 'Regular (small)' },
]

/** Validation mirrors the Laravel rules in testimonials-backend-spec.md (Part C). */
const schema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Max 200 characters'),
  image: z.any(),
  link: z
    .string()
    .trim()
    .min(1, 'Link is required')
    .max(2048, 'Max 2048 characters')
    .refine((v) => v.startsWith('/') || /^https?:\/\//.test(v), 'Use a site path like /client-portfolio/northstar-health or a full URL'),
  client_id: z.string(),
  project_id: z.string(),
  is_featured: z.boolean(),
  status: z.enum(['draft', 'published']),
  sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
})

const idOrNone = (id) => (id ? String(id) : NONE)
const noneOrId = (v) => (v === NONE ? null : Number(v))

const toFormValues = (s) => ({
  title: s?.title ?? '',
  image: s?.image_url ?? null,
  link: s?.link ?? '',
  client_id: idOrNone(s?.client_id),
  project_id: idOrNone(s?.project_id),
  is_featured: s?.is_featured ?? false,
  status: s?.status ?? 'draft',
  sort_order: s?.sort_order ?? 0,
})

function StoryForm({ story, clients, projects, onSaved, onCancel }) {
  const isEdit = !!story
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(story) })
  const { control, setValue } = form

  const onSubmit = async ({ image, ...v }) => {
    const payload = {
      ...v,
      client_id: noneOrId(v.client_id),
      project_id: noneOrId(v.project_id),
      // This API clears an image sent empty (`remove_image` is ignored).
      ...nullableImageField('image', image, story?.image_url),
    }
    try {
      if (isEdit) await successStoriesApi.update(story.id, payload)
      else await successStoriesApi.create(payload)
      toast.success(isEdit ? 'Story updated' : 'Story added')
      onSaved()
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field in v || field === 'image' ? field : 'title', { message: messages[0] }))
      toast.error(err.message || 'Could not save the story')
    }
  }

  const clientOptions = [{ value: NONE, label: 'None' }, ...clients.map((c) => ({ value: String(c.id), label: c.name }))]
  const projectOptions = [{ value: NONE, label: 'None' }, ...projects.map((p) => ({ value: String(p.id), label: p.title }))]

  // Picking a client while the link is empty suggests the client's portfolio page.
  const clientId = useWatch({ control, name: 'client_id' })
  const initialClient = useRef(clientId)
  useEffect(() => {
    if (clientId === initialClient.current) return
    const client = clients.find((c) => String(c.id) === clientId)
    if (client && !form.getValues('link')) setValue('link', `/client-portfolio/${client.slug}`, { shouldValidate: true })
  }, [clientId, clients, form, setValue])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <TextField control={control} name="title" label="Title *" max={200} multiline rows={2} placeholder="e.g. Northstar Health: Connected Care Platform" />
        <FormField
          control={control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <ImageUpload value={field.value} onChange={field.onChange} types={PHOTO.types} typesLabel={PHOTO.label} maxMb={IMAGE_MB.story} />
              <FormDescription>Optional. Landscape works best.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <TextField
          control={control}
          name="link"
          label="Link *"
          max={2048}
          placeholder="/client-portfolio/northstar-health"
          description="Where “Read more” goes — a site path or full URL."
        />
        <SelectField
          control={control}
          name="client_id"
          label="Client"
          options={clientOptions}
          description="Optional. Also lists this story on the client’s portfolio page."
        />
        <SelectField control={control} name="project_id" label="Portfolio Project" options={projectOptions} description="Optional." />
        <SwitchField
          control={control}
          name="is_featured"
          label="Featured (large card)"
          description={`Top row shows up to ${LIMITS.featuredStories} large cards; up to ${LIMITS.stories} regular cards go below.`}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField control={control} name="status" label="Status *" options={PUBLISH_STATUSES} />
          <SortOrderField control={control} description={null} className="w-full" />
        </div>
        <FormActions isSubmitting={form.formState.isSubmitting} submitLabel={isEdit ? 'Save changes' : 'Add story'} onCancel={onCancel} className="pt-2" />
      </form>
    </Form>
  )
}

export default function StoriesTab() {
  const [row, setRow] = useState('all')
  const [editing, setEditing] = useState(undefined)
  const [toDelete, setToDelete] = useState(null)

  const query = useApiQuery(() => successStoriesApi.list({ is_featured: row, per_page: 100, sort: 'sort_order' }), [row])
  const published = useApiQuery(() => successStoriesApi.list({ status: 'published', per_page: 100 }), [])
  const clients = useApiQuery(() => clientsApi.list({ per_page: 100, sort: 'sort_order' }), [])
  const projects = useApiQuery(() => projectsApi.list({ per_page: 100, sort: 'sort_order' }), [])
  const live = published.data?.data ?? []
  const featuredCount = live.filter((s) => s.is_featured).length

  const refresh = () => {
    query.refetch()
    published.refetch()
  }

  const update = async (story, patch, message) => {
    try {
      await successStoriesApi.update(story.id, patch)
      toast.success(message)
      refresh()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await successStoriesApi.remove(toDelete.id)
      toast.success('Story deleted')
      refresh()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Story',
      cell: (s) => (
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-16 shrink-0 place-items-center overflow-hidden rounded-md border bg-muted text-muted-foreground">
            {s.image_url ? <img src={s.image_url} alt="" className="size-full object-cover" /> : <ImageIcon className="size-4" />}
          </span>
          <div className="min-w-0">
            <p className="max-w-[360px] truncate font-medium">{s.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {s.client_name && <span className="font-medium text-primary">{s.client_name} · </span>}
              {s.link}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'is_featured',
      header: 'Card',
      cell: (s) =>
        s.is_featured ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-primary">
            <Star className="size-3" /> Featured
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Regular</span>
        ),
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
    },
    { key: 'status', header: 'Status', cell: (s) => <StatusBadge status={s.status} /> },
    { key: 'sort_order', header: 'Order', className: 'hidden sm:table-cell tabular-nums', headerClassName: 'hidden sm:table-cell' },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (s) => (
        <RowActions
          label={`Actions for ${s.title}`}
          onEdit={() => setEditing(s)}
          onDelete={() => setToDelete(s)}
          extra={[
            {
              label: s.status === 'published' ? 'Move to draft' : 'Publish',
              icon: s.status === 'published' ? EyeOff : Send,
              onSelect: () => update(s, { status: s.status === 'published' ? 'draft' : 'published' }, 'Story updated'),
            },
            {
              label: s.is_featured ? 'Make regular' : 'Make featured',
              icon: Star,
              onSelect: () => update(s, { is_featured: !s.is_featured }, s.is_featured ? 'Moved to the small cards' : 'Moved to the large cards'),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar
        actions={
          <Button onClick={() => setEditing(null)}>
            <Plus /> Add Story
          </Button>
        }
      >
        <FilterSelect value={row} onChange={setRow} options={ROW_OPTIONS} allLabel="All cards" label="Card size" />
      </TableToolbar>

      {published.data && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-b bg-muted/30 px-6 py-2.5 text-xs">
          <span className={cn(featuredCount > LIMITS.featuredStories ? 'font-medium text-warning' : 'text-muted-foreground')}>
            Large cards: <span className="tabular-nums">{featuredCount} / {LIMITS.featuredStories}</span>
          </span>
          <span className={cn(live.length > LIMITS.publishedStories ? 'font-medium text-warning' : 'text-muted-foreground')}>
            Published: <span className="tabular-nums">{live.length} / {LIMITS.publishedStories}</span>
          </span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        onRowClick={(s) => setEditing(s)}
        empty={<EmptyState icon={ImageIcon} title="No success stories yet" description="Add image cards for the “Success Stories” section." />}
      />

      <FormSheet
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
        title={editing ? 'Edit Story' : 'Add Story'}
        description="Image card in the “Success Stories” section."
      >
        {editing !== undefined && (
          <StoryForm
            key={editing?.id ?? 'new'}
            story={editing}
            clients={clients.data?.data ?? []}
            projects={projects.data?.data ?? []}
            onCancel={() => setEditing(undefined)}
            onSaved={() => {
              setEditing(undefined)
              refresh()
            }}
          />
        )}
      </FormSheet>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this story?"
        description={toDelete ? `“${toDelete.title}” will be removed from the website.` : undefined}
      />
    </Card>
  )
}
