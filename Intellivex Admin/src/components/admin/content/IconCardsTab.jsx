import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { EyeOff, Layers, Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import DataTable from '@/components/admin/tables/DataTable'
import TableToolbar from '@/components/admin/filters/TableToolbar'
import StatusBadge from '@/components/admin/common/StatusBadge'
import RowActions from '@/components/admin/common/RowActions'
import EmptyState from '@/components/admin/common/EmptyState'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import FormSheet from '@/components/admin/modals/FormSheet'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload from '@/components/admin/forms/ImageUpload'
import { SelectField, SortOrderField, TextField, imageField, nullableImageField } from '@/components/admin/forms/FormFields'
import { useApiQuery } from '@/hooks/useApiQuery'

const STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

/**
 * Per-module API rules. Defaults match the Partnerships platforms; Products'
 * deployable solutions pass their own (longer limits, required link, optional icon).
 */
const DEFAULT_RULES = {
  titleMax: 100,
  descriptionMax: 300,
  linkMax: 255,
  linkRequired: false,
  iconRequired: true,
  iconMb: 1,
  // true = the API clears an icon sent as null (instead of `remove_icon`).
  nullableIcon: false,
}

const buildSchema = (isEdit, rules) =>
  z
    .object({
      title: z.string().trim().min(1, 'Title is required').max(rules.titleMax, `Max ${rules.titleMax} characters`),
      description: z.string().trim().min(1, 'Description is required').max(rules.descriptionMax, `Max ${rules.descriptionMax} characters`),
      icon: z.any(),
      link: z
        .string()
        .trim()
        .max(rules.linkMax, `Max ${rules.linkMax} characters`)
        .refine((v) => !rules.linkRequired || v, 'Link is required')
        .refine((v) => !v || v.startsWith('/') || /^https?:\/\//.test(v), 'Use a site path like /services or a full URL'),
      status: z.enum(['draft', 'published']),
      sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
    })
    .superRefine((v, ctx) => {
      if (rules.iconRequired && !isEdit && !v.icon) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['icon'], message: 'Upload an icon for the card' })
    })

const toFormValues = (c) => ({
  title: c?.title ?? '',
  description: c?.description ?? '',
  icon: c?.icon_url ?? null,
  link: c?.link ?? '',
  status: c?.status ?? 'published',
  sort_order: c?.sort_order ?? 0,
})

function IconCardForm({ api, noun, card, rules, onSaved, onCancel }) {
  const isEdit = !!card
  const form = useForm({ resolver: zodResolver(buildSchema(isEdit, rules)), defaultValues: toFormValues(card) })
  const { control } = form

  const onSubmit = async ({ icon, ...values }) => {
    const iconPayload = (rules.nullableIcon ? nullableImageField : imageField)('icon', icon, card?.icon_url)
    const payload = { ...values, link: values.link || null, ...iconPayload }
    try {
      if (isEdit) await api.update(card.id, payload)
      else await api.create(payload)
      toast.success(isEdit ? `${noun} updated` : `${noun} added`)
      onSaved()
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field, { message: messages[0] }))
      toast.error(err.message || `Could not save the ${noun.toLowerCase()}`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <TextField control={control} name="title" label="Title *" max={rules.titleMax} placeholder="e.g. Cloud & Security" />
        <TextField control={control} name="description" label="Description *" max={rules.descriptionMax} multiline placeholder="Short text on the card." />
        <FormField
          control={control}
          name="icon"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Icon {rules.iconRequired && !isEdit && '*'}</FormLabel>
              <ImageUpload value={field.value} onChange={field.onChange} invalid={!!fieldState.error} contain maxMb={rules.iconMb} />
              <FormDescription>PNG, SVG, JPG or WebP, up to {rules.iconMb} MB.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <TextField
          control={control}
          name="link"
          label={rules.linkRequired ? 'Link *' : 'Link'}
          max={rules.linkMax}
          placeholder="/services/cloud-security"
          description={rules.linkRequired ? 'Where the card’s button goes — a site path or full URL.' : 'Optional — where the card goes when clicked.'}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField control={control} name="status" label="Status *" options={STATUSES} />
          <SortOrderField control={control} description={null} className="w-full" />
        </div>
        <FormActions
          isSubmitting={form.formState.isSubmitting}
          submitLabel={isEdit ? 'Save changes' : `Add ${noun.toLowerCase()}`}
          onCancel={onCancel}
          className="pt-2"
        />
      </form>
    </Form>
  )
}

/**
 * Tab listing simple icon + title + description cards (Partnerships "Supported
 * Platforms", Products "Deployable Solutions", …) with an add / edit drawer.
 *
 * @param api      createResource client
 * @param noun     singular label, e.g. "Platform"
 * @param section  website section the cards belong to, e.g. "Platforms & Technologies Supported"
 * @param page     website page name for the delete message, e.g. "Partnerships page"
 * @param limit    cards the design shows; more published cards trigger a warning
 * @param rules    API field rules overriding DEFAULT_RULES
 */
export default function IconCardsTab({ api, noun, section, page, limit, rules: customRules }) {
  const rules = { ...DEFAULT_RULES, ...customRules }
  // `editing`: undefined = sheet closed, null = new card, object = edit.
  const [editing, setEditing] = useState(undefined)
  const [toDelete, setToDelete] = useState(null)
  const query = useApiQuery(() => api.list({ per_page: 100, sort: 'sort_order' }), [])
  const rows = query.data?.data ?? []
  const liveCount = rows.filter((r) => r.status === 'published').length
  const lower = noun.toLowerCase()

  const toggleStatus = async (row) => {
    const next = row.status === 'published' ? 'draft' : 'published'
    try {
      await api.setStatus(row.id, next)
      toast.success(`${row.title} ${next === 'published' ? 'published' : 'moved to draft'}`)
      query.refetch()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await api.remove(toDelete.id)
      toast.success(`${noun} deleted`)
      query.refetch()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'title',
      header: noun,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border bg-accent text-primary">
            {row.icon_url ? <img src={row.icon_url} alt="" className="size-full object-contain p-1.5" /> : <Layers className="size-4" />}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{row.title}</p>
            <p className="max-w-[360px] truncate text-xs text-muted-foreground">{row.description}</p>
          </div>
        </div>
      ),
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { key: 'sort_order', header: 'Order', className: 'hidden sm:table-cell tabular-nums', headerClassName: 'hidden sm:table-cell' },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (row) => (
        <RowActions
          label={`Actions for ${row.title}`}
          onEdit={() => setEditing(row)}
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

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar
        actions={
          <Button onClick={() => setEditing(null)}>
            <Plus /> Add {noun}
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          Cards under “{section}”.{' '}
          <span className={liveCount > limit ? 'font-medium text-warning' : ''}>
            {liveCount} / {limit} published{liveCount > limit && ` — only the first ${limit} show`}
          </span>
        </p>
      </TableToolbar>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        onRowClick={(row) => setEditing(row)}
        empty={<EmptyState icon={Layers} title={`No ${lower}s yet`} description={`Add cards for the “${section}” section.`} />}
      />

      <FormSheet
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
        title={editing ? `Edit ${editing.title}` : `Add ${noun}`}
        description={`Card in the “${section}” section.`}
      >
        {editing !== undefined && (
          <IconCardForm
            key={editing?.id ?? 'new'}
            api={api}
            noun={noun}
            card={editing}
            rules={rules}
            onCancel={() => setEditing(undefined)}
            onSaved={() => {
              setEditing(undefined)
              query.refetch()
            }}
          />
        )}
      </FormSheet>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete this ${lower}?`}
        description={toDelete ? `“${toDelete.title}” will be removed from the ${page}.` : undefined}
      />
    </Card>
  )
}
