import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormSection from '@/components/admin/forms/FormSection'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import { FormSkeleton, TextField, imageField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import {
  CtaFields,
  HeadingBlock,
  ParagraphsField,
  SaveBar,
  ctaSchema,
  headingSchema,
  nullEmpty,
  optionalText,
  requiredText,
} from '@/components/admin/content/PageContentFields'
import { useApiQuery } from '@/hooks/useApiQuery'
import { servicesPageApi } from '@/services/admin/services'

/** Validation mirrors `services_page` in docs/pages-content-backend-spec.md. */
const schema = z
  .object({
    ...headingSchema('overview'),
    overview_description: requiredText(5000, 'Paragraphs'),
    overview_image: z.any(),
    overview_image_alt: optionalText(150),
    ...headingSchema('services'),
    ...ctaSchema,
  })
  .superRefine((v, ctx) => {
    if (v.overview_image && !v.overview_image_alt.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['overview_image_alt'], message: 'Describe the image for screen readers' })
    }
  })

const TEXT_FIELDS = Object.keys(schema.innerType().shape).filter((k) => k !== 'overview_image')

const toFormValues = (page) => ({
  ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, page[key] ?? ''])),
  overview_image: page.overview_image_url ?? null,
})

function PageContentForm({ page, onSaved }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(page) })
  const { control } = form

  const onSubmit = async ({ overview_image, ...values }) => {
    try {
      await servicesPageApi.update({ ...nullEmpty(values), ...imageField('overview_image', overview_image, page.overview_image_url) })
      toast.success('Services page updated')
      onSaved()
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field, { message: messages[0] }))
      toast.error(err.message || 'Could not save the page')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))} noValidate className="grid gap-4 sm:gap-6">
        <FormSection title="1 · Services Overview" description="Opening section of the Services page: heading, paragraphs and the image beside them.">
          <HeadingBlock control={control} prefix="overview" />
          <ParagraphsField control={control} name="overview_description" />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={control}
              name="overview_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} types={IMAGE_TYPES.photo.types} typesLabel={IMAGE_TYPES.photo.label} maxMb={3} className="max-w-xs" />
                  <FormDescription>Shown at 307 × 323. Empty = the website’s built-in image.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField control={control} name="overview_image_alt" label="Image Alt Text" max={150} placeholder="Describe the image" />
          </div>
        </FormSection>

        <FormSection
          title="2 · Our Services"
          description="Heading above the service cards (Services page). The cards themselves — icon, title, description, tags and order — are managed in the Services tab."
        >
          <HeadingBlock control={control} prefix="services" />
        </FormSection>

        <FormSection title="3 · CTA Banner" description="“Reimagine your business” banner at the bottom of the Services page.">
          <CtaFields control={control} />
        </FormSection>

        <SaveBar form={form} page={page} onReset={() => form.reset(toFormValues(page))} />
      </form>
    </Form>
  )
}

export default function PageContentTab() {
  const query = useApiQuery(() => servicesPageApi.get(), [])
  const page = query.data?.data

  if (query.error) {
    return (
      <Card>
        <ErrorState error={query.error} onRetry={query.refetch} />
      </Card>
    )
  }
  if (!page) return <FormSkeleton />
  // Refetching bumps `updated_at`, which remounts the form with the saved values.
  return <PageContentForm key={page.updated_at} page={page} onSaved={query.refetch} />
}
