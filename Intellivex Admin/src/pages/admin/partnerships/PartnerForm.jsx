import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import PageHeader from '@/components/admin/layout/PageHeader'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import { FormSkeleton, SelectField, SortOrderField, SwitchField, TextField, nullableImageField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { partnersApi, LIMITS, PARTNER_LIMITS as MAX, PARTNER_TYPES, PUBLISH_STATUSES } from '@/services/admin/partnerships'
import { SLUG_PATTERN, slugify } from '@/lib/format'

const PHOTO = IMAGE_TYPES.photo
const LOGO_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp']

/**
 * Validation mirrors the Laravel rules for /api/admin/partners, so every field the
 * API requires is checked — and highlighted — before the form is sent.
 */
const buildSchema = (isEdit) =>
  z
    .object({
      name: z.string().trim().min(1, 'Partner name is required').max(MAX.name, `Max ${MAX.name} characters`),
      // Optional: the API generates the slug from the name when it's empty.
      slug: z
        .string()
        .trim()
        .max(MAX.slug, `Max ${MAX.slug} characters`)
        .refine((v) => !v || SLUG_PATTERN.test(v), 'Use lowercase letters, numbers and dashes only'),
      type: z.enum(['technology', 'strategic', 'cloud', 'enterprise'], { errorMap: () => ({ message: 'Choose a partner type' }) }),
      website_link: z
        .string()
        .trim()
        .max(MAX.link, `Max ${MAX.link} characters`)
        .refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), 'Enter a full URL (https://…)'),
      logo: z.any(),
      alt_text: z.string().trim().min(1, 'Logo alt text is required').max(MAX.altText, `Max ${MAX.altText} characters`),
      show_as_strategic: z.boolean(),
      show_as_integration: z.boolean(),
      status: z.enum(['draft', 'published']),
      sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
      description: z.string().trim().max(MAX.description, `Max ${MAX.description.toLocaleString()} characters`),
      success_story: z.string().trim().max(MAX.successStory, `Max ${MAX.successStory.toLocaleString()} characters`),
      success_story_image: z.any(),
    })
    .superRefine((v, ctx) => {
      if (!isEdit && !v.logo) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['logo'], message: 'Upload the partner logo' })
    })

const toFormValues = (p) => ({
  name: p?.name ?? '',
  slug: p?.slug ?? '',
  type: p?.type ?? 'technology',
  website_link: p?.website_link ?? '',
  logo: p?.logo_url ?? null,
  alt_text: p?.alt_text ?? '',
  show_as_strategic: p?.show_as_strategic ?? false,
  show_as_integration: p?.show_as_integration ?? true,
  status: p?.status ?? 'draft',
  sort_order: p?.sort_order ?? 0,
  description: p?.description ?? '',
  success_story: p?.success_story ?? '',
  success_story_image: p?.success_story_image_url ?? null,
})

const toPayload = ({ logo, success_story_image, ...v }, original) => ({
  ...v,
  slug: v.slug || null,
  website_link: v.website_link || null,
  description: v.description || null,
  success_story: v.success_story || null,
  ...nullableImageField('logo', logo, original?.logo_url),
  ...nullableImageField('success_story_image', success_story_image, original?.success_story_image_url),
})

function PartnerFormBody({ partner }) {
  const navigate = useNavigate()
  const isEdit = !!partner
  const form = useForm({ resolver: zodResolver(buildSchema(isEdit)), defaultValues: toFormValues(partner) })
  const { control, setValue, getFieldState } = form

  // Slug and logo alt text follow the name until they're edited by hand (new partners only).
  const [name, strategic, integration] = useWatch({ control, name: ['name', 'show_as_strategic', 'show_as_integration'] })
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [altTouched, setAltTouched] = useState(isEdit)
  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(name), { shouldValidate: getFieldState('slug').isTouched })
    if (!altTouched) setValue('alt_text', name.trim() ? `${name.trim()} logo` : '', { shouldValidate: getFieldState('alt_text').isTouched })
  }, [name, slugTouched, altTouched, setValue, getFieldState])

  const onSubmit = async (values) => {
    try {
      const payload = toPayload(values, partner)
      if (isEdit) await partnersApi.update(partner.id, payload)
      else await partnersApi.create(payload)
      toast.success(isEdit ? 'Partner updated' : 'Partner created')
      navigate('/admin/partnerships')
    } catch (err) {
      // Any rule only the server knows still lands on its field.
      const errors = Object.entries(err.errors ?? {})
      errors.forEach(([field, messages]) => {
        const key = field.split('.')[0]
        if (key in values) form.setError(key, { message: messages[0] }, { shouldFocus: true })
      })
      toast.error(errors.length ? 'Please fix the highlighted fields' : err.message || 'Could not save the partner')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fill in the highlighted fields'))}
        noValidate
        className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3"
      >
        {/* Main column */}
        <div className="grid gap-4 sm:gap-6 xl:col-span-2">
          <FormSection title="Basic Info" description="Partner company details.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="name" label="Partner Name *" max={MAX.name} placeholder="e.g. Cloud Partner" />
              <SelectField control={control} name="type" label="Partner Type *" options={PARTNER_TYPES} />
            </div>
            <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <div className="flex rounded-md shadow-xs">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">/partnership/</span>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          setSlugTouched(true)
                          field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                        }}
                        placeholder="cloud-partner"
                        className="rounded-l-none shadow-none"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>Partner page URL. Filled from the name — leave empty to let the server generate it.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField
              control={control}
              name="website_link"
              label="Website Link"
              max={MAX.link}
              placeholder="https://partner.com"
              description="Optional — the logo links here."
            />
          </FormSection>

          <FormSection title="Detail Page" description="Optional — content for the partner’s own page (/partnership/{slug}).">
            <TextField
              control={control}
              name="description"
              label="Description"
              max={MAX.description}
              multiline
              rows={6}
              placeholder="Intro paragraphs. Leave a blank line between paragraphs."
            />
            <TextField control={control} name="success_story" label="Success Story" max={MAX.successStory} multiline rows={5} />
            <FormField
              control={control}
              name="success_story_image"
              render={({ field }) => (
                <FormItem className="max-w-md">
                  <FormLabel>Success Story Image</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} types={PHOTO.types} typesLabel={PHOTO.label} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
        </div>

        {/* Side column */}
        <div className="grid gap-4 sm:gap-6">
          <FormSection title="Logo" description="Transparent SVG, PNG or WebP works best.">
            <FormField
              control={control}
              name="logo"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Partner Logo {!isEdit && '*'}</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} invalid={!!fieldState.error} contain types={LOGO_TYPES} typesLabel="SVG, PNG, JPG or WebP" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="alt_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Alt Text *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setAltTouched(true)
                        field.onChange(e)
                      }}
                      placeholder="e.g. Cloud Partner logo"
                      maxLength={MAX.altText}
                    />
                  </FormControl>
                  <FormDescription>Describes the logo for screen readers. Filled from the name — edit if needed.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Where to Show" description="Sections of the Partnerships page this logo appears in.">
            <SwitchField
              control={control}
              name="show_as_strategic"
              label="Technology & Strategic Partners"
              description={`Logo row under the heading (up to ${LIMITS.strategic}).`}
            />
            <SwitchField
              control={control}
              name="show_as_integration"
              label="Partner / Integration Logos"
              description={`3 × 2 logo grid (up to ${LIMITS.integration}).`}
            />
            {!strategic && !integration && (
              <p className="rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">
                This logo won’t appear on the Partnerships page until one section is switched on.
              </p>
            )}
          </FormSection>

          <FormSection title="Visibility">
            <SelectField
              control={control}
              name="status"
              label="Status *"
              options={PUBLISH_STATUSES}
              description="Only published partners show on the website."
            />
            <SortOrderField control={control} />
          </FormSection>
        </div>

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg xl:col-span-3">
          <CardContent>
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              submitLabel={isEdit ? 'Save changes' : 'Create partner'}
              onCancel={() => navigate('/admin/partnerships')}
              onReset={form.formState.isDirty ? () => form.reset(toFormValues(partner)) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

/** Create (`/admin/partnerships/create`) and edit (`/admin/partnerships/:id/edit`) page for one partner. */
export default function PartnerForm() {
  const { id } = useParams()
  const isEdit = !!id
  const query = useApiQuery(() => (isEdit ? partnersApi.get(id) : Promise.resolve(null)), [id])
  const record = query.data?.data

  return (
    <>
      <PageHeader
        title={isEdit ? (record ? `Edit ${record.name}` : 'Edit Partner') : 'New Partner'}
        description={isEdit ? 'Update this partner’s logo and details.' : 'Add a partner logo to the Partnerships page.'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/partnerships">
              <ArrowLeft /> Back to partnerships
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
        <PartnerFormBody key={record?.id ?? 'new'} partner={record} />
      )}
    </>
  )
}
