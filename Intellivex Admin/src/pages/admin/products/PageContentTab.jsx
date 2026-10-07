import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import { FormSkeleton, TextField, nullableImageField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { formatDate } from '@/lib/format'
import { productsPageApi, IMAGE_MB, LIMITS } from '@/services/admin/products'
import { industriesApi, industryName } from '@/services/admin/industries'

const PHOTO = IMAGE_TYPES.photo
const required = (max, label) => z.string().trim().min(1, `${label} is required`).max(max, `Max ${max} characters`)
const optional = (max) => z.string().trim().max(max, `Max ${max} characters`)

/** Sections with a title + highlight, in website order. */
const SECTIONS = ['hero', 'featured', 'categories', 'deployable', 'use_cases', 'showcase']

/** Validation mirrors `products_page` in products-backend-spec.md §2.5 / §3.4. */
const schema = z
  .object({
    hero_eyebrow: required(100, 'Eyebrow'),
    hero_description: optional(2000),
    ...Object.fromEntries(SECTIONS.flatMap((s) => [[`${s}_title`, required(200, 'Title')], [`${s}_highlight`, optional(100)]])),
    product_button_label: required(80, 'Label'),
    demo_button_label: required(80, 'Label'),
    deployable_button_label: required(80, 'Label'),
    view_all_button_label: required(80, 'Label'),
    use_case_industry_ids: z.array(z.number()).length(LIMITS.useCases, `Pick exactly ${LIMITS.useCases} industries`),
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
      if (highlight && !v[`${prefix}_title`].includes(highlight)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [`${prefix}_highlight`], message: 'Must be part of the title' })
      }
    })
    if (v.cta_title && (!v.cta_button_label || !v.cta_button_url)) {
      if (!v.cta_button_label) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cta_button_label'], message: 'Add the button label for the banner' })
      if (!v.cta_button_url) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cta_button_url'], message: 'Add the button link for the banner' })
    }
    if (v.cta_image && !v.cta_image_alt) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cta_image_alt'], message: 'Describe the image for screen readers' })
    }
  })

const IMAGES = { cta_image: 'cta_image_url', og_image: 'og_image_url' }
const TEXT_FIELDS = Object.keys(schema.innerType().shape).filter((k) => !(k in IMAGES) && k !== 'use_case_industry_ids')
const toFormValues = (page) => ({
  ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, page[key] ?? ''])),
  use_case_industry_ids: page.use_case_industry_ids ?? (page.use_case_industries ?? []).map((i) => i.id),
  cta_image: page.cta_image_url ?? null,
  og_image: page.og_image_url ?? null,
})

/** "Title" + "Highlight" (the gradient part of the title). */
function TitleFields({ control, prefix }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField control={control} name={`${prefix}_title`} label="Title *" max={200} />
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

function UseCaseIndustries({ control, industries }) {
  return (
    <FormField
      control={control}
      name="use_case_industry_ids"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between gap-3">
            <FormLabel>Industries to show *</FormLabel>
            <span className="text-xs text-muted-foreground tabular-nums">
              {field.value.length} / {LIMITS.useCases}
            </span>
          </div>
          <FormDescription>Exactly {LIMITS.useCases} rows under “Industries / Use Cases”, in the order you tick them. Managed in the Industries module.</FormDescription>
          {industries === null ? (
            <p className="text-sm text-muted-foreground">Industries couldn’t be loaded. The page can be saved once they’re available.</p>
          ) : industries.length < LIMITS.useCases ? (
            <p className="text-sm text-warning">
              {industries.length === 0 ? 'There are no industries yet.' : `Only ${industries.length} industry exists.`} Add at least {LIMITS.useCases} in{' '}
              <Link to="/admin/industries" className="font-medium underline">
                Industries
              </Link>{' '}
              — the API needs {LIMITS.useCases} to save this page.
            </p>
          ) : null}
          <div className="grid gap-2.5 pt-1 sm:grid-cols-2 lg:grid-cols-3">
            {(industries ?? []).map((ind) => {
              const index = field.value.indexOf(ind.id)
              const checked = index !== -1
              const full = !checked && field.value.length >= LIMITS.useCases
              return (
                <label key={ind.id} className={`flex items-center gap-2.5 text-sm ${full ? 'opacity-50' : 'cursor-pointer'}`}>
                  <Checkbox
                    checked={checked}
                    disabled={full}
                    onCheckedChange={(on) => field.onChange(on ? [...field.value, ind.id] : field.value.filter((v) => v !== ind.id))}
                  />
                  <span className="truncate">{industryName(ind)}</span>
                  {checked && <span className="text-xs text-primary tabular-nums">#{index + 1}</span>}
                </label>
              )
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function PageContentForm({ page, industries, onSaved }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(page) })
  const { control } = form

  const onSubmit = async ({ cta_image, og_image, ...values }) => {
    const payload = {
      ...Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === '' ? null : v])),
      ...nullableImageField('cta_image', cta_image, page.cta_image_url),
      ...nullableImageField('og_image', og_image, page.og_image_url),
    }
    try {
      await productsPageApi.update(payload)
      toast.success('Products page updated')
      // Refetching bumps `updated_at`, which remounts the form with the saved values.
      onSaved()
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => {
        const key = field.split('.')[0]
        form.setError(key in values ? key : 'use_case_industry_ids', { message: messages[0] })
      })
      toast.error(err.message || 'Could not save the page')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))} noValidate className="grid gap-4 sm:gap-6">
        <FormSection title="1 · Overview" description="First section under the page header.">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="hero_eyebrow" label="Eyebrow *" max={100} />
          </div>
          <TitleFields control={control} prefix="hero" />
          <TextField control={control} name="hero_description" label="Description" max={2000} multiline rows={4} />
        </FormSection>

        <FormSection title="2 · Featured Products" description="Heading above the large product cards. Cards come from the Products tab (Featured).">
          <TitleFields control={control} prefix="featured" />
        </FormSection>

        <FormSection title="3 · Solution Categories" description="Heading above the category pills and the product list they filter. Pills are managed in the Solution Categories tab.">
          <TitleFields control={control} prefix="categories" />
        </FormSection>

        <FormSection title="4 · Ready-to-Deploy / Customizable Solutions" description="Heading above the cards. Cards are managed in the Deployable Solutions tab.">
          <TitleFields control={control} prefix="deployable" />
        </FormSection>

        <FormSection title="5 · Industries / Use Cases" description="Heading and the two industry rows.">
          <TitleFields control={control} prefix="use_cases" />
          <UseCaseIndustries control={control} industries={industries} />
        </FormSection>

        <FormSection title="6 · Product Showcase" description="Heading above the showcase cards. Cards come from the Products tab (Showcase).">
          <TitleFields control={control} prefix="showcase" />
        </FormSection>

        <FormSection title="Button Labels" description="Used on every card of the page.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <TextField control={control} name="product_button_label" label="Product Details *" max={80} />
            <TextField control={control} name="demo_button_label" label="Product Demo *" max={80} />
            <TextField control={control} name="deployable_button_label" label="Solution Card *" max={80} />
            <TextField control={control} name="view_all_button_label" label="“View All” *" max={80} />
          </div>
        </FormSection>

        <FormSection title="7 · CTA Banner" description="Banner at the bottom. Empty title = the site’s default banner.">
          <TitleFields control={control} prefix="cta" />
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

        <FormSection title="SEO" description="Search and social sharing for /products.">
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
  const query = useApiQuery(() => productsPageApi.get(), [])
  // Optional lookup: the form still loads when it fails (saving then needs the industries).
  const industries = useApiQuery(() => industriesApi.list({ per_page: 200, sort: 'sort_order' }), [])
  const page = query.data?.data

  if (query.error) {
    return (
      <Card>
        <ErrorState error={query.error} onRetry={query.refetch} />
      </Card>
    )
  }
  if (!page || industries.isLoading) return <FormSkeleton />
  return (
    <PageContentForm
      key={page.updated_at}
      page={page}
      industries={industries.error ? null : (industries.data?.data ?? [])}
      onSaved={query.refetch}
    />
  )
}
