import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import PageHeader from '@/components/admin/layout/PageHeader'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import { FormSkeleton, SelectField, SortOrderField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { STUDIO_STATUSES } from '@/services/admin/studio'
import { STUDIO_RECORDS } from './records'

const PHOTO = IMAGE_TYPES.photo

/** The API can replace an image but never remove one, so a record that has an image must keep one. */
const withImageRule = (schema, record, required, refine) =>
  schema.extend({ image: z.any() }).superRefine((v, ctx) => {
    refine?.(v, ctx)
    if (v.image) return
    if (required) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['image'], message: 'An image is required' })
    else if (record?.image_url)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['image'], message: 'Images can be replaced but not removed' })
  })

function RecordFormBody({ config, record }) {
  const navigate = useNavigate()
  const isEdit = !!record
  const { api, path, singular, image, sortable, Main, Side } = config
  const defaults = { ...config.toForm(record), status: record?.status ?? 'draft', ...(sortable && { sort_order: record?.sort_order ?? 0 }), image: record?.image_url ?? null }
  const schema = withImageRule(
    config.schema.extend({
      status: z.enum(['draft', 'published']),
      ...(sortable && { sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more') }),
    }),
    record,
    image?.required,
    config.refine,
  )
  const form = useForm({ resolver: zodResolver(schema), defaultValues: defaults })
  const { control } = form

  const onSubmit = async ({ image: file, status, sort_order, ...values }) => {
    try {
      const payload = { ...config.toPayload(values, record), status, ...(sortable && { sort_order }) }
      const saved = isEdit ? await api.update(record.id, payload) : await api.create(payload)
      // Upload on its own: multipart can't send empty lists, which would leave cleared ones unchanged.
      if (file instanceof File) {
        try {
          await api.update(saved.data.id, { image: file })
        } catch {
          toast.error(`${singular} saved, but the image could not be uploaded. Edit it to try again.`)
          return navigate(path)
        }
      }
      toast.success(isEdit ? `${singular} updated` : `${singular} created`)
      navigate(path)
    } catch (err) {
      const errors = Object.entries(err.errors ?? {})
      errors.forEach(([field, messages]) => {
        const key = field.split('.')[0]
        const formKey = config.errorKeys?.[key] ?? key
        if (formKey in defaults) form.setError(formKey, { message: messages[0] }, { shouldFocus: true })
      })
      toast.error(errors.length ? 'Please fix the highlighted fields' : err.message || `Could not save the ${singular.toLowerCase()}`)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fill in the highlighted fields'))}
        noValidate
        className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3"
      >
        <div className="grid gap-4 sm:gap-6 xl:col-span-2">
          <Main control={control} />
        </div>

        <div className="grid gap-4 sm:gap-6">
          {image && (
            <FormSection title={image.title} description={image.description}>
              <FormField
                control={control}
                name="image"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{image.label}</FormLabel>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      invalid={!!fieldState.error}
                      types={PHOTO.types}
                      typesLabel={PHOTO.label}
                      contain={image.contain}
                    />
                    {image.hint && <FormDescription>{image.hint}</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>
          )}

          <FormSection title="Visibility">
            <SelectField control={control} name="status" label="Status *" options={STUDIO_STATUSES} description="Only published records show on the website." />
            {sortable && <SortOrderField control={control} />}
          </FormSection>

          {Side && <Side control={control} />}
        </div>

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg xl:col-span-3">
          <CardContent>
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              submitLabel={isEdit ? 'Save changes' : `Create ${singular.toLowerCase()}`}
              onCancel={() => navigate(path)}
              onReset={form.formState.isDirty ? () => form.reset(defaults) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

/** Create (`…/create`) and edit (`…/:id/edit`) page for one Game Studio record; `type` is a key of STUDIO_RECORDS. */
export default function StudioRecordForm({ type }) {
  const config = STUDIO_RECORDS[type]
  const { id } = useParams()
  const isEdit = !!id
  const query = useApiQuery(() => (isEdit ? config.api.get(id) : Promise.resolve(null)), [id])
  const record = query.data?.data

  return (
    <>
      <PageHeader
        title={isEdit ? (record ? `Edit ${config.label(record)}` : `Edit ${config.singular}`) : `New ${config.singular}`}
        description={config.formDescription}
        actions={
          <Button variant="outline" asChild>
            <Link to={config.path}>
              <ArrowLeft /> Back to {config.title.toLowerCase()}
            </Link>
          </Button>
        }
      />
      {query.error ? (
        <Card>
          <ErrorState error={query.error} onRetry={query.refetch} />
        </Card>
      ) : query.isLoading ? (
        <FormSkeleton />
      ) : (
        <RecordFormBody key={record?.id ?? 'new'} config={config} record={record} />
      )}
    </>
  )
}
