import { Link } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import { FormSkeleton, SwitchField, TextField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { formatDate } from '@/lib/format'
import { portfolioPageApi, projectImage, categoryLabel, categoryActive, IMAGE_MB } from '@/services/admin/projects'
import { categoriesApi } from '@/services/admin/products'

const PHOTO = IMAGE_TYPES.photo
const required = (max, label) => z.string().trim().min(1, `${label} is required`).max(max, `Max ${max} characters`)
const optional = (max) => z.string().trim().max(max, `Max ${max} characters`)

/** Validation mirrors `portfolio_page` in portfolio-projects-backend-spec.md. */
const schema = z
  .object({
    overview_eyebrow: required(100, 'Eyebrow'),
    overview_title: required(200, 'Title'),
    overview_highlight: optional(100),
    overview_description: optional(2000),
    show_all_filter: z.boolean(),
    all_filter_label: optional(50),
    projects_eyebrow: required(100, 'Eyebrow'),
    projects_title: required(200, 'Title'),
    projects_highlight: optional(100),
    projects_description: optional(2000),
    card_button_label: required(80, 'Button label'),
    per_page: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(1, 'At least 1').max(24, 'Up to 24'),
    load_more_label: required(80, 'Button label'),
    is_cta_active: z.boolean(),
    cta_title: optional(200),
    cta_highlight: optional(100),
    cta_description: optional(2000),
    cta_button_label: optional(80),
    // The API validates this as a full URL — site paths like /contact are rejected.
    cta_button_url: optional(2048).refine((v) => !v || /^https?:\/\/\S+/.test(v), 'Enter a full URL, e.g. https://intellivex.com/contact'),
    cta_image: z.any(),
    cta_image_alt: optional(180),
    meta_title: optional(160),
    meta_description: optional(300),
    og_image: z.any(),
  })
  .superRefine((v, ctx) => {
    const need = (field, message) => !v[field] && ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message })
    if (v.is_cta_active) {
      need('cta_title', 'Title is required while the banner is shown')
      need('cta_button_label', 'Button label is required while the banner is shown')
      need('cta_button_url', 'Button link is required while the banner is shown')
    }
    if (v.show_all_filter) need('all_filter_label', 'Label is required for the “All” pill')
    if (v.cta_image) need('cta_image_alt', 'Describe the image for screen readers')
    // Highlights are the gradient part of their title.
    ;['overview', 'projects', 'cta'].forEach((prefix) => {
      const highlight = v[`${prefix}_highlight`]
      if (highlight && !v[`${prefix}_title`].includes(highlight)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [`${prefix}_highlight`], message: 'Must be part of the title' })
      }
    })
  })

const IMAGES = { cta_image: 'cta_image_url', og_image: 'og_image_url' }
const TEXT_FIELDS = Object.keys(schema.innerType().shape).filter((k) => !(k in IMAGES))
const toFormValues = (page) => ({
  ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, typeof page[key] === 'boolean' || typeof page[key] === 'number' ? page[key] : (page[key] ?? '')])),
  show_all_filter: Boolean(page.show_all_filter),
  is_cta_active: Boolean(page.is_cta_active),
  cta_image: page.cta_image_url ?? null,
  og_image: page.og_image_url ?? null,
})

/** "Title" + "Highlight" (the gradient part of the title). */
function TitleFields({ control, prefix, required: isRequired = true }) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <TextField control={control} name={`${prefix}_title`} label={isRequired ? 'Title *' : 'Title'} max={200} />
      <TextField control={control} name={`${prefix}_highlight`} label="Highlight" max={100} description="Gradient part of the title." />
    </div>
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

function PageContentForm({ page, categories, onSaved }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(page) })
  const { control } = form
  const [showAll, allLabel] = useWatch({ control, name: ['show_all_filter', 'all_filter_label'] })

  const onSubmit = async ({ cta_image, og_image, ...values }) => {
    const payload = {
      ...Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === '' ? null : v])),
      ...projectImage('cta_image', cta_image, page.cta_image_url),
      ...projectImage('og_image', og_image, page.og_image_url),
    }
    try {
      await portfolioPageApi.update(payload)
      toast.success('Portfolio page updated')
      // Refetching bumps `updated_at`, which remounts the form with the saved values.
      onSaved()
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field, { message: messages[0] }))
      toast.error(err.message || 'Could not save the page')
    }
  }

  const livePills = categories.filter(categoryActive)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))} noValidate className="grid gap-4 sm:gap-6">
        <FormSection title="1 · Overview" description="First section under the page header.">
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField control={control} name="overview_eyebrow" label="Eyebrow *" max={100} />
          </div>
          <TitleFields control={control} prefix="overview" />
          <TextField control={control} name="overview_description" label="Description" max={2000} multiline rows={4} />
        </FormSection>

        <FormSection title="2 · Category Pills" description="Filter pills above the projects. They come from Products → Solution Categories (active ones only).">
          <div className="flex flex-wrap items-center gap-2">
            {showAll && (
              <span className="rounded-full border border-primary bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">{allLabel || 'All'}</span>
            )}
            {livePills.map((c, i) => (
              <span
                key={c.id}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${!showAll && i === 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-primary/30 bg-accent text-primary'}`}
              >
                {categoryLabel(c)}
              </span>
            ))}
            {livePills.length === 0 && <span className="text-xs text-muted-foreground">No active categories.</span>}
            <Link to="/admin/products?tab=categories" className="ml-1 text-xs font-medium text-primary hover:underline">
              Manage categories →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <SwitchField control={control} name="show_all_filter" label="Add an “All” pill first" description="Lets visitors clear the filter." />
            {showAll && <TextField control={control} name="all_filter_label" label="“All” pill label *" max={50} />}
          </div>
        </FormSection>

        <FormSection title="3 · Recent Projects" description="Heading and buttons of the project list. Projects are managed in the Projects tab.">
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField control={control} name="projects_eyebrow" label="Eyebrow *" max={100} />
          </div>
          <TitleFields control={control} prefix="projects" />
          <TextField control={control} name="projects_description" label="Description" max={2000} multiline rows={3} />
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField control={control} name="card_button_label" label="Card Link Label *" max={80} />
            <FormField
              control={control}
              name="per_page"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel>Projects per load *</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} max={24} step={1} />
                  </FormControl>
                  <FormDescription>Shown first, and added by each “Load More”.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField control={control} name="load_more_label" label="Load More Label *" max={80} />
          </div>
        </FormSection>

        <FormSection title="4 · CTA Banner" description="Banner at the bottom of the Portfolio and Project Details pages.">
          <SwitchField control={control} name="is_cta_active" label="Show the banner" />
          <TitleFields control={control} prefix="cta" required={false} />
          <TextField control={control} name="cta_description" label="Description" max={2000} multiline rows={3} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="cta_button_label" label="Button Label" max={80} />
            <TextField control={control} name="cta_button_url" label="Button Link" max={2048} placeholder="https://intellivex.com/contact" description="Full URL — the API doesn’t accept site paths like /contact." />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <ImageField control={control} name="cta_image" label="Banner Image" description="Empty = the default device mockup." />
            <TextField control={control} name="cta_image_alt" label="Banner Image Alt Text" max={180} />
          </div>
        </FormSection>

        <FormSection title="SEO" description="Search and social sharing for /portfolio.">
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
  const query = useApiQuery(() => portfolioPageApi.get(), [])
  const categories = useApiQuery(() => categoriesApi.list({ per_page: 100, sort: 'sort_order' }), [])
  const page = query.data?.data
  const error = query.error || categories.error

  if (error) {
    return (
      <Card>
        <ErrorState
          error={error}
          onRetry={() => {
            query.refetch()
            categories.refetch()
          }}
        />
      </Card>
    )
  }
  if (!page || !categories.data) return <FormSkeleton />
  return <PageContentForm key={page.updated_at} page={page} categories={categories.data.data} onSaved={query.refetch} />
}
