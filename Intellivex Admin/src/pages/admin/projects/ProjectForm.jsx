import { useEffect, useMemo, useState } from 'react'
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
import TagInput from '@/components/admin/forms/TagInput'
import GalleryField from '@/components/admin/forms/GalleryField'
import RichTextEditor, { isEmptyHtml } from '@/components/admin/forms/RichTextEditor'
import { FormSkeleton, RowControls, SelectField, SortOrderField, SwitchField, TextField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import {
  projectsApi,
  projectImage,
  projectSiteUrl,
  categoryLabel,
  categoryActive,
  IMAGE_MB,
  LIMITS,
  PUBLISH_STATUSES,
} from '@/services/admin/projects'
import { categoriesApi } from '@/services/admin/products'
import { industriesApi, industryName } from '@/services/admin/industries'
import { SLUG_PATTERN, slugify } from '@/lib/format'

const NONE = 'none'
const PHOTO = IMAGE_TYPES.photo

const optionalUrl = z
  .string()
  .trim()
  .max(2048, 'Max 2048 characters')
  .refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), 'Enter a full URL (https://…)')

/** Validation mirrors the Laravel rules in portfolio-projects-backend-spec.md. */
const buildSchema = (isEdit) =>
  z
    .object({
      solution_category_id: z.string().min(1, 'Choose a category'),
      title: z.string().trim().min(1, 'Title is required').max(150, 'Max 150 characters'),
      // Optional: the API generates the slug from the title when it's empty.
      slug: z
        .string()
        .trim()
        .max(180, 'Max 180 characters')
        .refine((v) => !v || SLUG_PATTERN.test(v), 'Use lowercase letters, numbers and dashes only'),
      badge: z.string().trim().max(100, 'Max 100 characters'),
      short_description: z.string().trim().min(1, 'Short description is required').max(300, 'Max 300 characters'),
      tags: z
        .array(z.string().trim().max(LIMITS.tagLength, `Max ${LIMITS.tagLength} characters per tag`))
        .max(LIMITS.tags, `Up to ${LIMITS.tags} tags`)
        .refine((tags) => new Set(tags.map((t) => t.toLowerCase())).size === tags.length, 'Tags must be unique'),
      card_image: z.any(),
      card_image_alt: z.string().trim().max(180, 'Max 180 characters'),
      client_industry_text: z.string().trim().min(1, 'Client / Industry text is required').max(150, 'Max 150 characters'),
      client_industry_url: optionalUrl,
      linked_industry_id: z.string(),
      industry_ids: z.array(z.number()),
      heading: z.string().trim().min(1, 'Heading is required').max(200, 'Max 200 characters'),
      highlight: z.string().trim().max(100, 'Max 100 characters'),
      description: z.string().refine((v) => !isEmptyHtml(v), 'Description is required'),
      hero_image: z.any(),
      hero_image_alt: z.string().trim().max(180, 'Max 180 characters'),
      challenge_title: z.string().trim().min(1, 'Section title is required').max(180, 'Max 180 characters'),
      challenge_description: z.string().trim().max(3000, 'Max 3000 characters'),
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
        .max(LIMITS.challenges, `Up to ${LIMITS.challenges} items`),
      case_studies_title: z.string().trim().min(1, 'Section title is required').max(150, 'Max 150 characters'),
      gallery: z
        .array(z.object({ id: z.any().optional(), image: z.any(), alt: z.string().trim().max(180, 'Max 180 characters') }))
        .max(LIMITS.gallery, `Up to ${LIMITS.gallery} images`),
      project_url: optionalUrl,
      status: z.enum(['draft', 'published']),
      is_featured: z.boolean(),
      show_on_home: z.boolean(),
      sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
    })
    .superRefine((v, ctx) => {
      // The API requires alt text whenever an image exists.
      if (v.card_image && !v.card_image_alt) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['card_image_alt'], message: 'Describe the card image for screen readers' })
      }
      if (v.hero_image && !v.hero_image_alt) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['hero_image_alt'], message: 'Describe the hero image for screen readers' })
      }
      if (v.highlight && !v.heading.includes(v.highlight)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['highlight'], message: 'The highlight must be part of the heading' })
      }
      if (!isEdit && v.gallery.some((g) => !g.image)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['gallery'], message: 'Every new gallery item needs an image' })
      }
    })

const idOrNone = (id) => (id ? String(id) : NONE)
const noneOrId = (v) => (v === NONE ? null : Number(v))

const toFormValues = (p) => ({
  solution_category_id: String(p?.solution_category_id ?? p?.category?.id ?? ''),
  title: p?.title ?? '',
  slug: p?.slug ?? '',
  badge: p?.badge ?? '',
  short_description: p?.short_description ?? '',
  tags: p?.tags ?? [],
  card_image: p?.card_image_url ?? null,
  card_image_alt: p?.card_image_alt ?? '',
  client_industry_text: p?.client_industry_text ?? '',
  client_industry_url: p?.client_industry_url ?? '',
  linked_industry_id: idOrNone(p?.linked_industry_id),
  industry_ids: p?.industry_ids ?? (p?.industries ?? []).map((i) => i.id),
  heading: p?.heading ?? '',
  highlight: p?.highlight ?? '',
  description: p?.description ?? '',
  hero_image: p?.hero_image_url ?? null,
  hero_image_alt: p?.hero_image_alt ?? '',
  challenge_title: p?.challenge_title ?? 'The challenge of project',
  challenge_description: p?.challenge_description ?? '',
  challenges: (p?.challenges ?? []).map(({ id, text }) => ({ id, text })),
  case_studies_title: p?.case_studies_title ?? 'Case Studies',
  // GalleryField edits `{ id?, image: File | url, alt }`; the API uses `image_url` / `image_alt`.
  gallery: (p?.gallery ?? []).map(({ id, image_url, image_alt }) => ({ id, image: image_url, alt: image_alt ?? '' })),
  project_url: p?.project_url ?? '',
  status: p?.status ?? 'draft',
  is_featured: p?.is_featured ?? false,
  show_on_home: p?.show_on_home ?? false,
  sort_order: p?.sort_order ?? 0,
})

const NULLABLE_TEXT = [
  'slug',
  'badge',
  'card_image_alt',
  'client_industry_url',
  'highlight',
  'hero_image_alt',
  'challenge_description',
  'project_url',
]

const toPayload = ({ card_image, hero_image, gallery, ...v }, original, { withIndustries }) => {
  const payload = {
    ...v,
    ...Object.fromEntries(NULLABLE_TEXT.map((k) => [k, v[k] || null])),
    solution_category_id: Number(v.solution_category_id),
    challenges: v.challenges.map((c, i) => ({ ...c, sort_order: i })),
    // Kept items go back by id (without a file); omitted ids are deleted by the API.
    gallery: gallery.map((g, i) => ({
      ...(g.id != null && { id: g.id }),
      ...(g.image instanceof File && { image: g.image }),
      image_alt: g.alt || null,
      sort_order: i,
    })),
    ...projectImage('card_image', card_image, original?.card_image_url),
    ...projectImage('hero_image', hero_image, original?.hero_image_url),
  }
  // Industry links only go out when the industries list could be loaded, so an
  // unavailable Industries API never wipes existing links.
  if (withIndustries) payload.linked_industry_id = noneOrId(v.linked_industry_id)
  else {
    delete payload.linked_industry_id
    delete payload.industry_ids
  }
  return payload
}

function ProjectFormBody({ project, categories, industries }) {
  const navigate = useNavigate()
  const isEdit = !!project
  const schema = useMemo(() => buildSchema(isEdit), [isEdit])
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(project) })
  const { control, setValue, getFieldState } = form
  const challenges = useFieldArray({ control, name: 'challenges' })

  // Slug and heading follow the title until they're edited by hand (new projects only).
  const title = useWatch({ control, name: 'title' })
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [headingTouched, setHeadingTouched] = useState(isEdit)
  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(title), { shouldValidate: getFieldState('slug').isTouched })
    if (!headingTouched) setValue('heading', title, { shouldValidate: getFieldState('heading').isTouched })
  }, [title, slugTouched, headingTouched, setValue, getFieldState])

  const onSubmit = async (values) => {
    try {
      const payload = toPayload(values, project, { withIndustries: !!industries })
      if (isEdit) await projectsApi.update(project.id, payload)
      else await projectsApi.create(payload)
      toast.success(isEdit ? 'Project updated' : 'Project created')
      navigate('/admin/projects')
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => {
        // "tags.1" / "gallery.0.image" → the list field (it has the message slot); challenge rows have their own.
        const key = field.startsWith('challenges.') ? field : field.split('.')[0]
        form.setError(key in values ? key : 'root', { message: messages[0] })
      })
      toast.error(err.message || 'Could not save the project')
    }
  }

  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: categoryActive(c) ? categoryLabel(c) : `${categoryLabel(c)} (hidden)`,
  }))
  const industryOptions = [{ value: NONE, label: 'None' }, ...(industries ?? []).map((i) => ({ value: String(i.id), label: industryName(i) }))]
  const siteUrl = isEdit && project.status === 'published' ? projectSiteUrl(project) : null

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))}
        noValidate
        className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3"
      >
        {/* Main column */}
        <div className="grid gap-4 sm:gap-6 xl:col-span-2">
          <FormSection title="Basic Info" description="Name, URL and category (the filter pill) of the project.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="title" label="Title *" max={150} placeholder="e.g. AI-Powered Patient Portal" />
              <TextField control={control} name="badge" label="Badge" max={100} placeholder="e.g. Case Study" description="Small label on the card." />
            </div>
            <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <div className="flex rounded-md shadow-xs">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">/portfolio/</span>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          setSlugTouched(true)
                          field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                        }}
                        placeholder="ai-powered-patient-portal"
                        className="rounded-l-none shadow-none"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>Project Details URL. Filled from the title — leave empty to let the server generate it.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SelectField
              control={control}
              name="solution_category_id"
              label="Category (filter pill) *"
              options={categoryOptions}
              placeholder="Choose a category"
              description="Shared with Products → Solution Categories."
            />
          </FormSection>

          <FormSection title="Card" description="Card in “Recent Projects” (and Home / Industries when flagged).">
            <TextField control={control} name="short_description" label="Short Description *" max={300} multiline placeholder="One or two lines about the project." />
            <FormField
              control={control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-3">
                    <FormLabel>Tags</FormLabel>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {field.value.length} / {LIMITS.tags}
                    </span>
                  </div>
                  <FormControl>
                    <TagInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} max={LIMITS.tags} maxLength={LIMITS.tagLength} />
                  </FormControl>
                  <FormDescription>Press Enter or comma after each tag. Shown on the card and the detail page.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Detail Page — Intro" description="Top of the Project Details page.">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={control}
                name="heading"
                render={({ field }) => (
                  <FormItem className="content-start">
                    <FormLabel>Heading *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          setHeadingTouched(true)
                          field.onChange(e)
                        }}
                        placeholder={title || 'Best Features Provided By Intellivex'}
                      />
                    </FormControl>
                    <FormDescription>Filled from the title until you edit it.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TextField control={control} name="highlight" label="Highlight" max={100} placeholder="Intellivex" description="Gradient text — must appear in the heading." />
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
                      placeholder="Introduction under the heading — paragraphs, lists and links are supported."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Detail Page — Images" description="Large hero image, then the case-study gallery (2 per row).">
            <div className="grid gap-5 lg:grid-cols-2">
              <FormField
                control={control}
                name="hero_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image</FormLabel>
                    <ImageUpload value={field.value} onChange={field.onChange} types={PHOTO.types} typesLabel={PHOTO.label} maxMb={IMAGE_MB.hero} />
                    <FormDescription>~1060 × 500.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TextField control={control} name="hero_image_alt" label="Hero Image Alt Text" max={180} description="Required with a hero image." />
            </div>
            <TextField control={control} name="case_studies_title" label="Gallery / Case Studies Title *" max={150} />
            <FormField
              control={control}
              name="gallery"
              render={() => (
                <FormItem>
                  <FormLabel>Gallery</FormLabel>
                  <GalleryField control={control} max={LIMITS.gallery} maxMb={IMAGE_MB.gallery} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="The challenge of project" description="Title, paragraph and bullet list (two columns).">
            <TextField control={control} name="challenge_title" label="Section Title *" max={180} />
            <TextField control={control} name="challenge_description" label="Description" max={3000} multiline rows={4} />
            <div className="grid gap-3">
              <p className="text-sm font-medium">Challenge items</p>
              {challenges.fields.length === 0 && <p className="text-sm text-muted-foreground">No items yet.</p>}
              {challenges.fields.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="mt-2 w-5 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{index + 1}.</span>
                  <FormField
                    control={control}
                    name={`challenges.${index}.text`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="e.g. Unify fragmented workflows" aria-label={`Challenge ${index + 1}`} />
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
                <Plus /> Add item
              </Button>
            </div>
          </FormSection>
        </div>

        {/* Side column */}
        <div className="grid gap-4 sm:gap-6">
          <FormSection title="Card Image" description={`${PHOTO.label} up to ${IMAGE_MB.card} MB.`}>
            <FormField
              control={control}
              name="card_image"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="sr-only">Card Image</FormLabel>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!fieldState.error}
                    types={PHOTO.types}
                    typesLabel={PHOTO.label}
                    maxMb={IMAGE_MB.card}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField control={control} name="card_image_alt" label="Image Alt Text" max={180} description="Required with a card image." />
          </FormSection>

          <FormSection title="Visibility & Flags">
            <SelectField control={control} name="status" label="Status *" options={PUBLISH_STATUSES} description="Only published projects show on the website." />
            <SwitchField control={control} name="is_featured" label="Featured" description="Industries page “Featured Projects”." />
            <SwitchField control={control} name="show_on_home" label="Show on Home page" description={`Home page “Projects” (up to ${LIMITS.home} published).`} />
            <SortOrderField control={control} description="Portfolio order; also sets Previous / Next." />
            {siteUrl && (
              <Button variant="outline" size="sm" asChild className="justify-self-start">
                <a href={siteUrl} target="_blank" rel="noreferrer">
                  <ExternalLink /> View on website
                </a>
              </Button>
            )}
          </FormSection>

          <FormSection title="Client / Industry" description="The “Client / Industry” line on the detail page.">
            <TextField control={control} name="client_industry_text" label="Display text *" max={150} placeholder="e.g. Healthcare" />
            <TextField control={control} name="client_industry_url" label="Link" max={2048} placeholder="https://…" description="Optional — makes the text a link." />
            {industries ? (
              <>
                <SelectField control={control} name="linked_industry_id" label="Linked Industry" options={industryOptions} />
                <FormField
                  control={control}
                  name="industry_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Industries</FormLabel>
                      <FormDescription>Show this project on these industry pages.</FormDescription>
                      <div className="grid gap-2.5 pt-1 sm:grid-cols-2 xl:grid-cols-1">
                        {industries.length === 0 && <p className="text-sm text-muted-foreground">No industries yet.</p>}
                        {industries.map((ind) => (
                          <label key={ind.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                            <Checkbox
                              checked={field.value.includes(ind.id)}
                              onCheckedChange={(on) => field.onChange(on ? [...field.value, ind.id] : field.value.filter((v) => v !== ind.id))}
                            />
                            <span className="truncate">{industryName(ind)}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Industries couldn’t be loaded, so industry links are left unchanged. They can be set once the Industries API is available.
              </p>
            )}
          </FormSection>

          <FormSection title="Extra">
            <TextField control={control} name="project_url" label="Live Project URL" max={2048} placeholder="https://client.com" />
          </FormSection>
        </div>

        {form.formState.errors.root && <p className="text-sm text-destructive xl:col-span-3">{form.formState.errors.root.message}</p>}

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg xl:col-span-3">
          <CardContent>
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              submitLabel={isEdit ? 'Save changes' : 'Create project'}
              onCancel={() => navigate('/admin/projects')}
              onReset={form.formState.isDirty ? () => form.reset(toFormValues(project)) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

/** Create (`/admin/projects/create`) and edit (`/admin/projects/:id/edit`) page. */
export default function ProjectForm() {
  const { id } = useParams()
  const isEdit = !!id
  const project = useApiQuery(() => (isEdit ? projectsApi.get(id) : Promise.resolve(null)), [id])
  const categories = useApiQuery(() => categoriesApi.list({ per_page: 200, sort: 'sort_order' }), [])
  // Optional lookup: the form still works (without industry links) when it fails.
  const industries = useApiQuery(() => industriesApi.list({ per_page: 200, sort: 'sort_order' }), [])

  const required = [project, categories]
  const record = project.data?.data
  const error = required.find((q) => q.error)?.error
  const loading = required.some((q) => q.isLoading) || industries.isLoading

  return (
    <>
      <PageHeader
        title={isEdit ? (record ? `Edit ${record.title}` : 'Edit Project') : 'New Project'}
        description={isEdit ? 'Update the project card and its Project Details page.' : 'Add a case study to the portfolio.'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/projects">
              <ArrowLeft /> Back to portfolio
            </Link>
          </Button>
        }
      />
      {error ? (
        <Card>
          <ErrorState error={error} onRetry={() => required.forEach((q) => q.refetch())} />
        </Card>
      ) : loading ? (
        <FormSkeleton />
      ) : (
        <ProjectFormBody
          key={record?.id ?? 'new'}
          project={record}
          categories={categories.data?.data ?? []}
          industries={industries.error ? null : (industries.data?.data ?? [])}
        />
      )}
    </>
  )
}
