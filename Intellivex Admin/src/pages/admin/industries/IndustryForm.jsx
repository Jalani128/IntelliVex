import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ExternalLink, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import PageHeader from '@/components/admin/layout/PageHeader'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import RichTextEditor, { isEmptyHtml } from '@/components/admin/forms/RichTextEditor'
import { FormSkeleton, RowControls, SelectField, SortOrderField, SwitchField, TextField, nullableImageField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { industriesApi, industryName, industrySiteUrl, INDUSTRY_STATUSES, IMAGE_MB, LIMITS } from '@/services/admin/industries'
import { servicesApi, serviceName } from '@/services/admin/services'
import { projectsApi } from '@/services/admin/projects'
import { SLUG_PATTERN, slugify } from '@/lib/format'

const PHOTO = IMAGE_TYPES.photo
const ICON = IMAGE_TYPES.icon

/** Validation mirrors the Laravel rules in industries-backend-spec.md. */
const schema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(150, 'Max 150 characters'),
    highlight: z.string().trim().max(100, 'Max 100 characters'),
    // Optional: the API generates the slug from the title when it's empty.
    slug: z
      .string()
      .trim()
      .max(180, 'Max 180 characters')
      .refine((v) => !v || SLUG_PATTERN.test(v), 'Use lowercase letters, numbers and dashes only'),
    icon: z.any(),
    short_description: z.string().trim().min(1, 'Short description is required').max(300, 'Max 300 characters'),
    button_label: z.string().trim().min(1, 'Button label is required').max(80, 'Max 80 characters'),
    eyebrow: z.string().trim().min(1, 'Eyebrow is required').max(100, 'Max 100 characters'),
    description: z
      .string()
      .refine((v) => !isEmptyHtml(v), 'Description is required')
      .refine((v) => v.length <= LIMITS.descriptionLength, `Max ${LIMITS.descriptionLength.toLocaleString()} characters`),
    image: z.any(),
    image_alt: z.string().trim().max(180, 'Max 180 characters'),
    challenges_title: z.string().trim().min(1, 'Section title is required').max(150, 'Max 150 characters'),
    challenges: z
      .array(
        z.object({
          id: z.any().optional(),
          text: z
            .string()
            .trim()
            .min(1, 'Write the challenge or remove this row')
            .max(LIMITS.challengeLength, `Max ${LIMITS.challengeLength} characters`),
        }),
      )
      .max(LIMITS.challenges, `Up to ${LIMITS.challenges} challenges`),
    case_studies_title: z.string().trim().min(1, 'Section title is required').max(150, 'Max 150 characters'),
    service_ids: z.array(z.number()),
    project_ids: z.array(z.number()),
    status: z.enum(['draft', 'published']),
    is_featured: z.boolean(),
    show_in_menu: z.boolean(),
    sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
    meta_title: z.string().trim().max(160, 'Max 160 characters'),
    meta_description: z.string().trim().max(300, 'Max 300 characters'),
    og_image: z.any(),
  })
  .superRefine((v, ctx) => {
    // The API checks the highlight case-insensitively against the title.
    if (v.highlight && !v.title.toLowerCase().includes(v.highlight.toLowerCase())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['highlight'], message: 'The highlight must be part of the title' })
    }
    if (v.image && !v.image_alt) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['image_alt'], message: 'Describe the image for screen readers' })
    }
  })

const toFormValues = (i) => ({
  title: i?.title ?? '',
  highlight: i?.highlight ?? '',
  slug: i?.slug ?? '',
  icon: i?.icon_url ?? null,
  short_description: i?.short_description ?? '',
  button_label: i?.button_label ?? 'EXPLORE',
  eyebrow: i?.eyebrow ?? 'Industry',
  description: i?.description ?? '',
  image: i?.image_url ?? null,
  image_alt: i?.image_alt ?? '',
  challenges_title: i?.challenges_title ?? 'Key Challenges',
  challenges: (i?.challenges ?? []).map(({ id, text }) => ({ id, text })),
  case_studies_title: i?.case_studies_title ?? 'Case Studies',
  service_ids: i?.service_ids ?? [],
  project_ids: i?.project_ids ?? [],
  status: i?.status ?? 'draft',
  is_featured: i?.is_featured ?? false,
  show_in_menu: i?.show_in_menu ?? false,
  sort_order: i?.sort_order ?? 0,
  meta_title: i?.meta_title ?? '',
  meta_description: i?.meta_description ?? '',
  og_image: i?.og_image_url ?? null,
})

const toPayload = ({ icon, image, og_image, ...v }, original, { withServices, withProjects }) => {
  const payload = {
    ...v,
    slug: v.slug || null,
    highlight: v.highlight || null,
    image_alt: v.image_alt || null,
    meta_title: v.meta_title || null,
    meta_description: v.meta_description || null,
    challenges: v.challenges.map((c, i) => ({ text: c.text, sort_order: i })),
    // This API clears an image sent empty (`remove_{field}` is ignored).
    ...nullableImageField('icon', icon, original?.icon_url),
    ...nullableImageField('image', image, original?.image_url),
    ...nullableImageField('og_image', og_image, original?.og_image_url),
  }
  // Omitted lists are left unchanged by the API — so a lookup that failed to load never clears links.
  if (!withServices) delete payload.service_ids
  if (!withProjects) delete payload.project_ids
  return payload
}

/** Checkbox list of related records (services / projects). */
function RelationField({ control, name, items, label, empty }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">{name}</FormLabel>
          {items === null ? (
            <p className="text-sm text-muted-foreground">Couldn’t be loaded — existing links are left unchanged.</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{empty}</p>
          ) : (
            <div className="grid max-h-72 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-1">
              {items.map((item) => (
                <label key={item.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={field.value.includes(item.id)}
                    onCheckedChange={(on) => field.onChange(on ? [...field.value, item.id] : field.value.filter((v) => v !== item.id))}
                  />
                  <span className="truncate">{label(item)}</span>
                  {item.status && item.status !== 'published' && <span className="text-xs text-muted-foreground">(draft)</span>}
                </label>
              ))}
            </div>
          )}
          {items?.length > 0 && <FormDescription>{field.value.length} selected · drafts are hidden on the website.</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function IndustryFormBody({ industry, services, projects }) {
  const navigate = useNavigate()
  const isEdit = !!industry
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(industry) })
  const { control, setValue, getFieldState } = form
  const { isSubmitting } = form.formState

  const challenges = useFieldArray({ control, name: 'challenges' })

  // Keep the slug in step with the title until the admin edits it by hand (new industries only).
  const [title, highlight] = useWatch({ control, name: ['title', 'highlight'] })
  const [slugTouched, setSlugTouched] = useState(isEdit)
  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(title), { shouldValidate: getFieldState('slug').isTouched })
  }, [title, slugTouched, setValue, getFieldState])

  const onSubmit = async (values) => {
    try {
      const payload = toPayload(values, industry, { withServices: !!services, withProjects: !!projects })
      if (isEdit) await industriesApi.update(industry.id, payload)
      else await industriesApi.create(payload)
      toast.success(isEdit ? 'Industry updated' : 'Industry created')
      navigate('/admin/industries')
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => {
        // "service_ids.0" → the list field (it has the message slot); challenge rows have their own.
        const [root, index] = field.split('.')
        const key = root === 'challenges' && index != null ? `challenges.${index}.text` : root
        form.setError(root in values ? key : 'root', { message: messages[0] })
      })
      toast.error(err.message || 'Could not save the industry')
    }
  }

  const siteUrl = isEdit && industry.status === 'published' ? industrySiteUrl(industry) : null

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))}
        noValidate
        className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3"
      >
        {/* Main column */}
        <div className="grid gap-4 sm:gap-6 xl:col-span-2">
          <FormSection title="Basic Info" description="Name and URL of the industry.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="title" label="Title *" max={150} placeholder="e.g. Financial Services & FinTech" />
              <TextField
                control={control}
                name="highlight"
                label="Highlight"
                max={100}
                placeholder="e.g. FinTech"
                description="Part of the title shown in the blue gradient."
              />
            </div>
            <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <div className="flex rounded-md shadow-xs">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">/industries/</span>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          setSlugTouched(true)
                          field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                        }}
                        placeholder="fintech"
                        className="rounded-l-none shadow-none"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>Page URL. Filled from the title — leave empty to let the server generate it.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Listing Card" description="Row in the “Industries We Serve” list and the header menu.">
            <TextField
              control={control}
              name="short_description"
              label="Short Description *"
              max={300}
              multiline
              placeholder="One or two lines shown next to the industry name."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="button_label" label="Button Label *" max={80} placeholder="EXPLORE" />
            </div>
          </FormSection>

          <FormSection title="Detail Page — Intro" description="Top of the Industry Details page.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="eyebrow" label="Eyebrow *" max={100} placeholder="Industry" />
            </div>
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="Intro under the heading — paragraphs, lists and links are supported."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Key Challenges" description="Section title and a bullet list (shown in two columns).">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="challenges_title" label="Section Title *" max={150} placeholder="Key Challenges" />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Challenge items</p>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {challenges.fields.length} / {LIMITS.challenges}
                </span>
              </div>
              {challenges.fields.length === 0 && <p className="text-sm text-muted-foreground">No challenges yet.</p>}
              {challenges.fields.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="mt-2 w-5 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{index + 1}.</span>
                  <FormField
                    control={control}
                    name={`challenges.${index}.text`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="e.g. Modernizing legacy platforms" aria-label={`Challenge ${index + 1}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <RowControls index={index} count={challenges.fields.length} onMove={challenges.move} onRemove={challenges.remove} label={`challenge ${index + 1}`} />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-self-start"
                disabled={challenges.fields.length >= LIMITS.challenges}
                onClick={() => challenges.append({ text: '' })}
              >
                <Plus /> Add challenge
              </Button>
            </div>
          </FormSection>

          <FormSection title="Case Studies" description="Portfolio projects shown under this heading on the detail page.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="case_studies_title" label="Section Title *" max={150} placeholder="Case Studies" />
            </div>
            <RelationField control={control} name="project_ids" items={projects} label={(p) => p.title} empty="No portfolio projects yet." />
          </FormSection>

          <FormSection title="SEO" description="Search and social sharing. Leave empty to use the title and short description.">
            <TextField control={control} name="meta_title" label="Meta Title" max={160} placeholder={industryName({ title, highlight }) || 'Industry title'} />
            <TextField control={control} name="meta_description" label="Meta Description" max={300} multiline rows={2} />
            <FormField
              control={control}
              name="og_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Share Image</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} types={PHOTO.types} typesLabel={PHOTO.label} maxMb={IMAGE_MB.og} className="max-w-sm" />
                  <FormDescription>Recommended 1200 × 630.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
        </div>

        {/* Side column */}
        <div className="grid gap-4 sm:gap-6">
          <FormSection title="Visibility & Flags" description="Where this industry appears on the website.">
            <SelectField control={control} name="status" label="Status *" options={INDUSTRY_STATUSES} description="Only published industries show on the website." />
            <SwitchField control={control} name="show_in_menu" label="Show in Header Menu" description="Adds it to the Industries dropdown." />
            <SwitchField control={control} name="is_featured" label="Featured" description="Returned by the website’s featured-industries list." />
            <SortOrderField control={control} />
            {siteUrl && (
              <Button variant="outline" size="sm" asChild className="justify-self-start">
                <a href={siteUrl} target="_blank" rel="noreferrer">
                  <ExternalLink /> View on website
                </a>
              </Button>
            )}
          </FormSection>

          <FormSection title="Media" description={`${ICON.label} icon up to ${IMAGE_MB.icon} MB · ${PHOTO.label} image up to ${IMAGE_MB.image} MB.`}>
            <FormField
              control={control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Icon</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} contain types={ICON.types} typesLabel={ICON.label} maxMb={IMAGE_MB.icon} />
                  <FormDescription>Shown in the “Industries We Serve” list.</FormDescription>
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
                  <ImageUpload value={field.value} onChange={field.onChange} types={PHOTO.types} typesLabel={PHOTO.label} maxMb={IMAGE_MB.image} />
                  <FormDescription>Optional — shown with the intro.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField control={control} name="image_alt" label="Image Alt Text" max={180} placeholder="Describe the image" description="Required with an image." />
          </FormSection>

          <FormSection title="Relevant Services" description="Service cards under “Relevant Services” on the detail page.">
            <RelationField control={control} name="service_ids" items={services} label={serviceName} empty="No services yet." />
          </FormSection>
        </div>

        {form.formState.errors.root && <p className="text-sm text-destructive xl:col-span-3">{form.formState.errors.root.message}</p>}

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg xl:col-span-3">
          <CardContent>
            <FormActions
              isSubmitting={isSubmitting}
              submitLabel={isEdit ? 'Save changes' : 'Create industry'}
              onCancel={() => navigate('/admin/industries')}
              onReset={form.formState.isDirty ? () => form.reset(toFormValues(industry)) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

/** Create (`/admin/industries/create`) and edit (`/admin/industries/:id/edit`) page. */
export default function IndustryForm() {
  const { id } = useParams()
  const isEdit = !!id

  const industry = useApiQuery(() => (isEdit ? industriesApi.get(id) : Promise.resolve(null)), [id])
  // Optional lookups: the form still works (leaving links unchanged) when they fail.
  const services = useApiQuery(() => servicesApi.list({ per_page: 100, sort: 'sort_order' }), [])
  const projects = useApiQuery(() => projectsApi.list({ per_page: 100, sort: 'sort_order' }), [])

  const record = industry.data?.data
  const loading = industry.isLoading || services.isLoading || projects.isLoading

  return (
    <>
      <PageHeader
        title={isEdit ? (record ? `Edit ${industryName(record)}` : 'Edit Industry') : 'New Industry'}
        description={isEdit ? 'Update the content shown for this industry on the website.' : 'Add an industry to the website.'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/industries">
              <ArrowLeft /> Back to industries
            </Link>
          </Button>
        }
      />
      {industry.error ? (
        <Card>
          <ErrorState error={industry.error} onRetry={industry.refetch} />
        </Card>
      ) : loading ? (
        <FormSkeleton />
      ) : (
        <IndustryFormBody
          key={record?.id ?? 'new'}
          industry={record}
          services={services.error ? null : (services.data?.data ?? [])}
          projects={projects.error ? null : (projects.data?.data ?? [])}
        />
      )}
    </>
  )
}
