import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import { FormSkeleton, TextField, nullableImageField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { formatDate } from '@/lib/format'
import { industriesPageApi, IMAGE_MB } from '@/services/admin/industries'

const PHOTO = IMAGE_TYPES.photo
const required = (max, label) => z.string().trim().min(1, `${label} is required`).max(max, `Max ${max} characters`)
const optional = (max) => z.string().trim().max(max, `Max ${max} characters`)

/** Sections with a title + highlight + description, in website order. */
const SECTIONS = ['overview', 'industries', 'featured_projects']

/** Validation mirrors `industries_page` in industries-backend-spec.md. */
const schema = z
  .object({
    ...Object.fromEntries(
      SECTIONS.flatMap((s) => [
        [`${s}_title`, required(200, 'Title')],
        [`${s}_highlight`, optional(100)],
        [`${s}_description`, optional(2000)],
      ]),
    ),
    featured_projects_limit: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(1, 'At least 1').max(12, 'Up to 12'),
    cta_title: optional(200),
    cta_highlight: optional(100),
    cta_description: optional(2000),
    cta_button_label: optional(80),
    cta_button_url: optional(2048).refine((v) => !v || v.startsWith('/') || /^https?:\/\/\S+/.test(v), 'Use a site path like /contact or a full URL'),
    cta_image: z.any(),
    cta_image_alt: optional(180),
    meta_title: optional(160),
    meta_description: optional(300),
    og_image: z.any(),
  })
  .superRefine((v, ctx) => {
    // Highlights are the gradient part of their title.
    ;[...SECTIONS, 'cta'].forEach((prefix) => {
      const highlight = v[`${prefix}_highlight`]
      if (highlight && !v[`${prefix}_title`].toLowerCase().includes(highlight.toLowerCase())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [`${prefix}_highlight`], message: 'Must be part of the title' })
      }
    })
    if (v.cta_title && !v.cta_button_label) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cta_button_label'], message: 'Add the button label for the banner' })
    if (v.cta_title && !v.cta_button_url) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cta_button_url'], message: 'Add the button link for the banner' })
    if (v.cta_image && !v.cta_image_alt) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cta_image_alt'], message: 'Describe the image for screen readers' })
  })

// This singleton returns its images as `cta_image` / `og_image` (absolute URLs).
const IMAGES = ['cta_image', 'og_image']
const TEXT_FIELDS = Object.keys(schema.innerType().shape).filter((k) => !IMAGES.includes(k))
const toFormValues = (page) => ({
  ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, page[key] ?? ''])),
  cta_image: page.cta_image ?? page.cta_image_url ?? null,
  og_image: page.og_image ?? page.og_image_url ?? null,
})

function SectionFields({ control, prefix, title }) {
  return (
    <FormSection title={title}>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField control={control} name={`${prefix}_title`} label="Title *" max={200} />
        <TextField control={control} name={`${prefix}_highlight`} label="Highlight" max={100} description="Gradient part of the title." />
      </div>
      <TextField control={control} name={`${prefix}_description`} label="Description" max={2000} multiline rows={3} />
    </FormSection>
  )
}

function ImageField({ control, name, label, description }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <ImageUpload value={field.value} onChange={field.onChange} types={PHOTO.types} typesLabel={PHOTO.label} maxMb={IMAGE_MB.page} />
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function PageContentForm({ page, onSaved }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(page) })
  const { control } = form
  const original = toFormValues(page)

  const onSubmit = async ({ cta_image, og_image, ...values }) => {
    const payload = {
      ...Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === '' ? null : v])),
      ...nullableImageField('cta_image', cta_image, original.cta_image),
      ...nullableImageField('og_image', og_image, original.og_image),
    }
    try {
      await industriesPageApi.update(payload)
      toast.success('Industries page updated')
      // Refetching bumps `updated_at`, which remounts the form with the saved values.
      onSaved()
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field, { message: messages[0] }))
      toast.error(err.message || 'Could not save the page')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))} noValidate className="grid gap-4 sm:gap-6">
        <SectionFields control={control} prefix="overview" title="1 · Overview" />
        <SectionFields control={control} prefix="industries" title="2 · Industries We Serve" />
        <SectionFields control={control} prefix="featured_projects" title="3 · Featured Projects" />
        <FormSection title="Featured Projects — cards" description="Portfolio projects marked “Featured”, in portfolio order.">
          <FormField
            control={control}
            name="featured_projects_limit"
            render={({ field }) => (
              <FormItem className="max-w-40">
                <FormLabel>Projects to show *</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={1} max={12} step={1} />
                </FormControl>
                <FormDescription>1–12</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="4 · CTA Banner" description="Banner at the bottom of the Industries and Industry Details pages. Empty title = the site’s default banner.">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="cta_title" label="Title" max={200} />
            <TextField control={control} name="cta_highlight" label="Highlight" max={100} />
          </div>
          <TextField control={control} name="cta_description" label="Description" max={2000} multiline rows={3} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="cta_button_label" label="Button Label" max={80} />
            <TextField control={control} name="cta_button_url" label="Button Link" max={2048} placeholder="/contact" />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <ImageField control={control} name="cta_image" label="Banner Image" description="Empty = the default device mockup." />
            <TextField control={control} name="cta_image_alt" label="Banner Image Alt Text" max={180} />
          </div>
        </FormSection>

        <FormSection title="SEO" description="Search and social sharing for /industries.">
          <TextField control={control} name="meta_title" label="Meta Title" max={160} />
          <TextField control={control} name="meta_description" label="Meta Description" max={300} multiline rows={2} />
          <div className="grid gap-5 lg:grid-cols-2">
            <ImageField control={control} name="og_image" label="Social Share Image" description="~1200 × 630." />
          </div>
        </FormSection>

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Last saved {formatDate(page.updated_at)}</p>
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              submitLabel="Save page"
              onReset={form.formState.isDirty ? () => form.reset(toFormValues(page)) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

export default function PageContentTab() {
  const query = useApiQuery(() => industriesPageApi.get(), [])
  const page = query.data?.data

  if (query.error) {
    return (
      <Card>
        <ErrorState error={query.error} onRetry={query.refetch} />
      </Card>
    )
  }
  if (!page) return <FormSkeleton />
  return <PageContentForm key={page.updated_at} page={page} onSaved={query.refetch} />
}
