import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Plus } from 'lucide-react'
import { cn, SITE_NAVY_BG } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import PageHeader from '@/components/admin/layout/PageHeader'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import RichTextEditor, { isEmptyHtml } from '@/components/admin/forms/RichTextEditor'
import { FormSkeleton, RowControls, SwitchField, TextField, imageField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { servicesApi, serviceName, CARD_VARIANTS, SERVICE_STATUSES } from '@/services/admin/services'
import { industriesApi, industryName } from '@/services/admin/industries'
import { SLUG_PATTERN, slugify } from '@/lib/format'

const NO_PARENT = 'none'

/** Validation mirrors the Laravel rules in docs/services-backend-spec. */
const buildSchema = (isEdit) =>
  z
    .object({
      title: z.string().trim().min(1, 'Title is required').max(150, 'Max 150 characters'),
      highlight: z.string().trim().max(100, 'Max 100 characters'),
      // Optional: the API generates the slug from the title when it's empty.
      slug: z
        .string()
        .trim()
        .max(180, 'Max 180 characters')
        .refine((v) => !v || SLUG_PATTERN.test(v), 'Use lowercase letters, numbers and dashes only'),
      eyebrow: z.string().trim().min(1, 'Eyebrow is required').max(50, 'Max 50 characters'),
      parent_id: z.string(),
      card_variant: z.enum(['default', 'innovation']),
      short_description: z.string().trim().min(1, 'Short description is required').max(300, 'Max 300 characters'),
      // Optional (nullable in the spec): the detail page falls back to its built-in intro.
      description: z.string(),
      icon: z.any(),
      image: z.any(),
      image_alt: z.string().trim().max(180, 'Max 180 characters'),
      tags: z.array(
        z.object({
          id: z.any().optional(),
          text: z.string().trim().min(1, 'Write the tag or remove this row').max(100, 'Max 100 characters'),
        }),
      ),
      benefits_title: z.string().trim().min(1, 'Benefits title is required').max(150, 'Max 150 characters'),
      benefits_description: z.string().trim().max(1000, 'Max 1000 characters'),
      benefits: z.array(
        z.object({
          id: z.any().optional(),
          text: z.string().trim().min(1, 'Write the benefit or remove this row').max(200, 'Max 200 characters'),
        }),
      ),
      faqs: z.array(
        z.object({
          id: z.any().optional(),
          question: z.string().trim().min(1, 'Question is required').max(255, 'Max 255 characters'),
          answer: z.string().trim().min(1, 'Answer is required').max(5000, 'Max 5000 characters'),
          is_active: z.boolean(),
        }),
      ),
      industry_ids: z.array(z.number()),
      status: z.enum(['draft', 'published']),
      is_featured: z.boolean(),
      show_in_menu: z.boolean(),
      show_on_services_page: z.boolean(),
      sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
      meta_title: z.string().trim().max(160, 'Max 160 characters'),
      meta_description: z.string().trim().max(300, 'Max 300 characters'),
      og_image: z.any(),
    })
    .superRefine((v, ctx) => {
      // Default cards show the icon; innovation cards don't have one.
      if (!isEdit && v.card_variant === 'default' && !v.icon) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['icon'], message: 'Upload an icon for the service card' })
      }
      // The API requires alt text whenever a detail image exists.
      if (v.image && !v.image_alt.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['image_alt'], message: 'Describe the image for screen readers' })
      }
    })

const toFormValues = (s) => ({
  title: s?.title ?? '',
  highlight: s?.highlight ?? '',
  slug: s?.slug ?? '',
  eyebrow: s?.eyebrow ?? 'Service',
  parent_id: s?.parent_id ? String(s.parent_id) : NO_PARENT,
  card_variant: s?.card_variant ?? 'default',
  short_description: s?.short_description ?? '',
  description: s?.description ?? '',
  icon: s?.icon_url ?? null,
  image: s?.image_url ?? null,
  image_alt: s?.image_alt ?? '',
  // Admin detail sends [{ id, text, sort_order }]; plain strings are accepted too.
  tags: (s?.tags ?? []).map((t) => (typeof t === 'string' ? { text: t } : { id: t.id, text: t.text })),
  benefits_title: s?.benefits_title ?? 'Our Benefits',
  benefits_description: s?.benefits_description ?? '',
  benefits: (s?.benefits ?? []).map(({ id, text }) => ({ id, text })),
  faqs: (s?.faqs ?? []).map(({ id, question, answer, is_active }) => ({ id, question, answer, is_active })),
  // Admin detail may send `industry_ids` or the public-style `industries` list.
  industry_ids: s?.industry_ids ?? (s?.industries ?? []).map((i) => i.id),
  status: s?.status ?? 'draft',
  is_featured: s?.is_featured ?? false,
  show_in_menu: s?.show_in_menu ?? false,
  show_on_services_page: s?.show_on_services_page ?? true,
  sort_order: s?.sort_order ?? 0,
  meta_title: s?.meta_title ?? '',
  meta_description: s?.meta_description ?? '',
  og_image: s?.og_image_url ?? null,
})

const toPayload = (v, original) => {
  const { icon, image, og_image, ...rest } = v
  return {
    ...rest,
    slug: v.slug || null,
    highlight: v.highlight || null,
    benefits_description: v.benefits_description || null,
    parent_id: v.parent_id === NO_PARENT ? null : Number(v.parent_id),
    image_alt: v.image_alt || null,
    description: isEmptyHtml(v.description) ? null : v.description,
    meta_title: v.meta_title || null,
    meta_description: v.meta_description || null,
    tags: v.tags.map((t, i) => ({ ...t, sort_order: i })),
    benefits: v.benefits.map((b, i) => ({ ...b, sort_order: i })),
    faqs: v.faqs.map((f, i) => ({ ...f, sort_order: i })),
    ...imageField('icon', icon, original?.icon_url),
    ...imageField('image', image, original?.image_url),
    ...imageField('og_image', og_image, original?.og_image_url),
  }
}

function ServiceFormBody({ service, parents, industries, industriesError }) {
  const navigate = useNavigate()
  const isEdit = !!service
  const schema = useMemo(() => buildSchema(isEdit), [isEdit])
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(service) })
  const { control, setValue, getFieldState } = form
  const { isSubmitting } = form.formState

  const tags = useFieldArray({ control, name: 'tags' })
  const benefits = useFieldArray({ control, name: 'benefits' })
  const faqs = useFieldArray({ control, name: 'faqs' })

  // Keep the slug in step with the title until the admin edits it by hand (new services only).
  const [title, highlight, cardVariant, parentId, image] = useWatch({ control, name: ['title', 'highlight', 'card_variant', 'parent_id', 'image'] })
  const [slugTouched, setSlugTouched] = useState(isEdit)
  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(`${title} ${highlight}`), { shouldValidate: getFieldState('slug').isTouched })
  }, [title, highlight, slugTouched, setValue, getFieldState])

  const onSubmit = async (values) => {
    try {
      const payload = toPayload(values, service)
      if (isEdit) await servicesApi.update(service.id, payload)
      else await servicesApi.create(payload)
      toast.success(isEdit ? 'Service updated' : 'Service created')
      navigate('/admin/services')
    } catch (err) {
      // Laravel 422 → show each message under its field (`benefits.0.text` maps straight onto the form).
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field, { message: messages[0] }))
      toast.error(err.message || 'Could not save the service')
    }
  }

  const onInvalid = () => toast.error('Please fix the highlighted fields')

  const parentOptions = parents.filter((p) => p.id !== service?.id && !p.parent_id)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3">
        {/* Main column */}
        <div className="grid gap-4 sm:gap-6 xl:col-span-2">
          <FormSection title="Basic Info" description="Name and URL of the service.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="title" label="Title *" max={150} placeholder="e.g. AI &" />
              <TextField
                control={control}
                name="highlight"
                label="Highlight"
                max={100}
                placeholder="e.g. Data Innovation"
                description="Shown after the title in the blue gradient."
              />
            </div>
            <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <div className="flex rounded-md shadow-xs">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">/services/</span>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          setSlugTouched(true)
                          field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                        }}
                        placeholder="ai-data-innovation"
                        className="rounded-l-none shadow-none"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>Page URL. Filled from the title — edit if needed; left empty, the server generates it.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField control={control} name="eyebrow" label="Eyebrow *" max={50} placeholder="Service" description="Small label above the title on the detail page." />
            <FormField
              control={control}
              name="card_variant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card style *</FormLabel>
                  <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
                    {CARD_VARIANTS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={field.value === opt.value}
                        onClick={() => field.onChange(opt.value)}
                        className={cn(
                          'rounded-lg border p-3.5 text-left transition-colors',
                          field.value === opt.value ? 'border-primary bg-accent/60 ring-1 ring-primary' : 'hover:bg-muted/60',
                        )}
                      >
                        <span className="block text-sm font-medium">{opt.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{opt.hint}</span>
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Content" description="Text for the service cards and the detail page intro.">
            <TextField
              control={control}
              name="short_description"
              label="Short Description *"
              max={300}
              multiline
              placeholder="One or two lines shown on the service card."
              description="Used on the home page, Services page and industry pages."
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="Intro for the detail page — headings, lists and links are supported."
                    />
                  </FormControl>
                  <FormDescription>Shown under the title on the service detail page.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            title="Card Tags"
            description="Sub-services shown as tag pills on the service card (Services page and Home), in this order."
          >
            <div className="grid gap-3">
              {tags.fields.length === 0 && <p className="text-sm text-muted-foreground">No tags yet.</p>}
              {tags.fields.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="mt-2 w-5 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{index + 1}.</span>
                  <FormField
                    control={control}
                    name={`tags.${index}.text`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="e.g. API Development & Integration" aria-label={`Tag ${index + 1}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <RowControls index={index} count={tags.fields.length} onMove={tags.move} onRemove={tags.remove} label={`tag ${index + 1}`} />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="justify-self-start" onClick={() => tags.append({ text: '' })}>
                <Plus /> Add tag
              </Button>
            </div>
          </FormSection>

          <FormSection title="Benefits" description="“Our Benefits” section on the detail page.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="benefits_title" label="Section Title *" max={150} placeholder="Our Benefits" />
            </div>
            <TextField control={control} name="benefits_description" label="Section Description" max={1000} multiline placeholder="Paragraph above the benefit list." />
            <div className="grid gap-3">
              <p className="text-sm font-medium">Benefit items</p>
              {benefits.fields.length === 0 && <p className="text-sm text-muted-foreground">No benefits yet.</p>}
              {benefits.fields.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="mt-2 w-5 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{index + 1}.</span>
                  <FormField
                    control={control}
                    name={`benefits.${index}.text`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="e.g. Faster delivery with a dedicated team" aria-label={`Benefit ${index + 1}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <RowControls index={index} count={benefits.fields.length} onMove={benefits.move} onRemove={benefits.remove} label={`benefit ${index + 1}`} />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="justify-self-start" onClick={() => benefits.append({ text: '' })}>
                <Plus /> Add benefit
              </Button>
            </div>
          </FormSection>

          <FormSection title="FAQs" description="“Frequently Asked Questions” on the detail page. Inactive FAQs stay hidden.">
            {faqs.fields.length === 0 && <p className="text-sm text-muted-foreground">No FAQs yet.</p>}
            {faqs.fields.map((item, index) => (
              <div key={item.id} className="grid gap-3 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">FAQ {index + 1}</span>
                  <div className="flex items-center gap-3">
                    <FormField
                      control={control}
                      name={`faqs.${index}.is_active`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch size="sm" checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                          </FormControl>
                          <FormLabel className="text-xs font-normal text-muted-foreground">Active</FormLabel>
                        </FormItem>
                      )}
                    />
                    <RowControls index={index} count={faqs.fields.length} onMove={faqs.move} onRemove={faqs.remove} label={`FAQ ${index + 1}`} />
                  </div>
                </div>
                <TextField control={control} name={`faqs.${index}.question`} label="Question *" max={255} placeholder="e.g. How long does a project take?" />
                <TextField control={control} name={`faqs.${index}.answer`} label="Answer *" max={5000} multiline placeholder="Answer shown when the question is opened." />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="justify-self-start" onClick={() => faqs.append({ question: '', answer: '', is_active: true })}>
              <Plus /> Add FAQ
            </Button>
          </FormSection>

          <FormSection title="SEO" description="Search and social sharing. Leave empty to use the title and short description.">
            <TextField control={control} name="meta_title" label="Meta Title" max={160} placeholder={serviceName({ title, highlight }) || 'Service title'} />
            <TextField control={control} name="meta_description" label="Meta Description" max={300} multiline rows={3} />
            <FormField
              control={control}
              name="og_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Share Image</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} types={IMAGE_TYPES.photo.types} typesLabel={IMAGE_TYPES.photo.label} maxMb={3} className="max-w-sm" />
                  <FormDescription>Recommended 1200 × 630. Empty = the detail image is used.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
        </div>

        {/* Side column */}
        <div className="grid gap-4 sm:gap-6">
          <FormSection title="Visibility & Flags" description="Where this service appears on the website.">
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_STATUSES.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Only published services show on the website.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SwitchField control={control} name="is_featured" label="Featured on Home" description="Shows in the home page “Our Services” grid (3 cards)." />
            <SwitchField control={control} name="show_in_menu" label="Show in Header Menu" description="Adds it to the Services dropdown." />
            <SwitchField control={control} name="show_on_services_page" label="Show on Services Page" description="Card in the Services page grid." />
            <FormField
              control={control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} step={1} className="w-32" />
                  </FormControl>
                  <FormDescription>Lower numbers show first.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Media" description="Icon: PNG or SVG up to 1 MB · Image: JPG, PNG or WebP up to 3 MB.">
            <FormField
              control={control}
              name="icon"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Card Icon {cardVariant === 'default' && !isEdit && '*'}</FormLabel>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!fieldState.error}
                    types={IMAGE_TYPES.icon.types}
                    typesLabel={IMAGE_TYPES.icon.label}
                    maxMb={1}
                    contain
                    previewClassName={SITE_NAVY_BG}
                  />
                  <FormDescription>
                    {cardVariant === 'innovation' ? 'Not shown on innovation cards.' : 'Shown on the service card.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail Page Image</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} types={IMAGE_TYPES.photo.types} typesLabel={IMAGE_TYPES.photo.label} maxMb={3} />
                  <FormDescription>Recommended 1060 × 409.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField control={control} name="image_alt" label={image ? "Image Alt Text *" : "Image Alt Text"} max={180} placeholder="Describe the image" />
          </FormSection>

          <FormSection title="Relations">
            <FormField
              control={control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Service</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_PARENT}>None — main service</SelectItem>
                      {parentOptions.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {serviceName(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {parentId === NO_PARENT
                      ? 'Pick a parent to make this a sub-service (a tag pill on the parent’s page).'
                      : 'Shown as a tag pill on the parent service page.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="industry_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industries</FormLabel>
                  <FormDescription>Shows under “Relevant Services” on these industry pages.</FormDescription>
                  {industriesError && (
                    <p className="rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">
                      Couldn’t load industries ({industriesError.message}). Saved industries are kept.
                    </p>
                  )}
                  <div className="grid gap-2.5 pt-1 sm:grid-cols-2 xl:grid-cols-1">
                    {industries.map((ind) => {
                      const checked = field.value.includes(ind.id)
                      return (
                        <label key={ind.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(on) =>
                              field.onChange(on ? [...field.value, ind.id] : field.value.filter((v) => v !== ind.id))
                            }
                          />
                          {industryName(ind)}
                        </label>
                      )
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
        </div>

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg xl:col-span-3">
          <CardContent>
            <FormActions
              isSubmitting={isSubmitting}
              submitLabel={isEdit ? 'Save changes' : 'Create service'}
              onCancel={() => navigate('/admin/services')}
              onReset={form.formState.isDirty ? () => form.reset(toFormValues(service)) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

/** Create (`/admin/services/create`) and edit (`/admin/services/:id/edit`) page. */
export default function ServiceForm() {
  const { id } = useParams()
  const isEdit = !!id

  const service = useApiQuery(() => (isEdit ? servicesApi.get(id) : Promise.resolve(null)), [id])
  // The services API caps per_page at 100.
  const parents = useApiQuery(() => servicesApi.list({ per_page: 100, sort: 'sort_order' }), [])
  const industries = useApiQuery(() => industriesApi.list({ per_page: 100, sort: 'sort_order' }), [])

  const record = service.data?.data
  const loading = service.isLoading || parents.isLoading || industries.isLoading
  // Industries only feed one optional checkbox list — if that API is down the form still works.
  const error = service.error || parents.error

  const back = (
    <Button variant="outline" asChild>
      <Link to="/admin/services">
        <ArrowLeft /> Back to services
      </Link>
    </Button>
  )

  return (
    <>
      <PageHeader
        title={isEdit ? (record ? `Edit ${serviceName(record)}` : 'Edit Service') : 'New Service'}
        description={isEdit ? 'Update the content shown for this service on the website.' : 'Add a service to the website.'}
        actions={back}
      />
      {error ? (
        <Card>
          <ErrorState
            error={error}
            onRetry={() => {
              service.refetch()
              parents.refetch()
              industries.refetch()
            }}
          />
        </Card>
      ) : loading ? (
        <FormSkeleton />
      ) : (
        <ServiceFormBody
          key={record?.id ?? 'new'}
          service={record}
          parents={parents.data?.data ?? []}
          industries={industries.data?.data ?? []}
          industriesError={industries.error}
        />
      )}
    </>
  )
}
