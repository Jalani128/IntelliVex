import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import PageHeader from '@/components/admin/layout/PageHeader'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload from '@/components/admin/forms/ImageUpload'
import RichTextEditor, { isEmptyHtml } from '@/components/admin/forms/RichTextEditor'
import { FormSkeleton, SelectField, SortOrderField, SwitchField, TextField, nullableImageField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { clientsApi, clientSiteUrl, IMAGE_MB, LIMITS, PUBLISH_STATUSES } from '@/services/admin/testimonials'
import { industriesApi, industryName } from '@/services/admin/industries'
import { SLUG_PATTERN, slugify } from '@/lib/format'

/** Logos may be SVG as well as photos. */
const LOGO_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp']
const LOGO_LABEL = 'SVG, PNG, JPG or WebP'

const longText = (label) =>
  z.string().refine((v) => v.length <= LIMITS.longText, `${label} must be under ${LIMITS.longText.toLocaleString()} characters`)

/** Validation mirrors the Laravel rules in testimonials-backend-spec.md (Part B). */
const schema = z.object({
  name: z.string().trim().min(1, 'Client name is required').max(150, 'Max 150 characters'),
  // Optional: the API generates the slug from the name when it's empty.
  slug: z
    .string()
    .trim()
    .max(180, 'Max 180 characters')
    .refine((v) => !v || SLUG_PATTERN.test(v), 'Use lowercase letters, numbers and dashes only'),
  logo: z.any(),
  website: z
    .string()
    .trim()
    .max(2048, 'Max 2048 characters')
    .refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), 'Enter a full URL (https://…)'),
  industry: z.string().trim().max(150, 'Max 150 characters'),
  portfolio_heading: z.string().trim().max(200, 'Max 200 characters'),
  portfolio_description: longText('Description'),
  success_story: longText('Success story'),
  show_in_logo_bar: z.boolean(),
  show_in_portfolio: z.boolean(),
  status: z.enum(['draft', 'published']),
  sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
})

const toFormValues = (c) => ({
  name: c?.name ?? '',
  slug: c?.slug ?? '',
  logo: c?.logo_url ?? null,
  website: c?.website ?? '',
  industry: c?.industry ?? '',
  portfolio_heading: c?.portfolio_heading ?? '',
  portfolio_description: c?.portfolio_description ?? '',
  success_story: c?.success_story ?? '',
  show_in_logo_bar: c?.show_in_logo_bar ?? false,
  show_in_portfolio: c?.show_in_portfolio ?? true,
  status: c?.status ?? 'draft',
  sort_order: c?.sort_order ?? 0,
})

const toPayload = ({ logo, ...v }, original) => ({
  ...v,
  slug: v.slug || null,
  website: v.website || null,
  industry: v.industry || null,
  portfolio_heading: v.portfolio_heading || null,
  portfolio_description: isEmptyHtml(v.portfolio_description) ? null : v.portfolio_description,
  success_story: isEmptyHtml(v.success_story) ? null : v.success_story,
  ...nullableImageField('logo', logo, original?.logo_url),
})

function RichField({ control, name, label, description, placeholder }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RichTextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} placeholder={placeholder} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function ClientFormBody({ client, industries }) {
  const navigate = useNavigate()
  const isEdit = !!client
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(client) })
  const { control, setValue, getFieldState } = form

  // Keep the slug in step with the name until the admin edits it by hand (new clients only).
  const name = useWatch({ control, name: 'name' })
  const [slugTouched, setSlugTouched] = useState(isEdit)
  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(name), { shouldValidate: getFieldState('slug').isTouched })
  }, [name, slugTouched, setValue, getFieldState])

  const onSubmit = async (values) => {
    try {
      const payload = toPayload(values, client)
      if (isEdit) await clientsApi.update(client.id, payload)
      else await clientsApi.create(payload)
      toast.success(isEdit ? 'Client updated' : 'Client created')
      navigate('/admin/client-stories')
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => {
        const key = field.split('.')[0]
        form.setError(key in values ? key : 'root', { message: messages[0] })
      })
      toast.error(err.message || 'Could not save the client')
    }
  }

  const siteUrl = isEdit && client.status === 'published' && client.show_in_portfolio ? clientSiteUrl(client) : null

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))}
        noValidate
        className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3"
      >
        {/* Main column */}
        <div className="grid gap-4 sm:gap-6 xl:col-span-2">
          <FormSection title="Client" description="Name, URL and industry label.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="name" label="Client Name *" max={150} placeholder="e.g. Northstar Health" />
              <FormField
                control={control}
                name="industry"
                render={({ field }) => (
                  <FormItem className="content-start">
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input {...field} list="client-industries" placeholder="e.g. Healthcare" maxLength={150} />
                    </FormControl>
                    <datalist id="client-industries">
                      {industries.map((i) => (
                        <option key={i.id} value={industryName(i)} />
                      ))}
                    </datalist>
                    <FormDescription>Label under the logo. Pick a website industry or type your own.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <div className="flex rounded-md shadow-xs">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">/client-portfolio/</span>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          setSlugTouched(true)
                          field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                        }}
                        placeholder="northstar-health"
                        className="rounded-l-none shadow-none"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>Client Portfolio page URL. Filled from the name — leave empty to let the server generate it.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField control={control} name="website" label="Website" max={2048} placeholder="https://client.com" description="Optional — the logo links here in the logo bar." />
          </FormSection>

          <FormSection title="Client Portfolio Page" description="Content for /client-portfolio/{slug}. Shown only while “Client Portfolio” is on.">
            <TextField
              control={control}
              name="portfolio_heading"
              label="Heading"
              max={200}
              placeholder={name ? `A better digital experience for ${name}` : 'A better digital experience for …'}
              description="Empty = the client name."
            />
            <RichField control={control} name="portfolio_description" label="Description" placeholder="Introduction to the client and the work — paragraphs, lists and links are supported." />
            <RichField
              control={control}
              name="success_story"
              label="Success Story"
              placeholder="The challenge, what was built and the outcome."
              description="Shown in the “Success Stories” box on the client’s page."
            />
          </FormSection>
        </div>

        {/* Side column */}
        <div className="grid gap-4 sm:gap-6">
          <FormSection title="Logo" description={`${LOGO_LABEL} up to ${IMAGE_MB.logo} MB. Transparent logos work best.`}>
            <FormField
              control={control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Logo</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} contain types={LOGO_TYPES} typesLabel={LOGO_LABEL} maxMb={IMAGE_MB.logo} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Where to Show" description="Sections of the Testimonials page (published clients only).">
            <SwitchField control={control} name="show_in_logo_bar" label="Logo bar" description={`Logo row at the top (up to ${LIMITS.logoBar}).`} />
            <SwitchField
              control={control}
              name="show_in_portfolio"
              label="Client Portfolio"
              description={`Logo grid with a link to the client’s page (up to ${LIMITS.portfolio}).`}
            />
          </FormSection>

          <FormSection title="Visibility">
            <SelectField control={control} name="status" label="Status *" options={PUBLISH_STATUSES} description="Only published clients show on the website." />
            <SortOrderField control={control} />
            {siteUrl && (
              <Button variant="outline" size="sm" asChild className="justify-self-start">
                <a href={siteUrl} target="_blank" rel="noreferrer">
                  <ExternalLink /> View on website
                </a>
              </Button>
            )}
          </FormSection>
        </div>

        {form.formState.errors.root && <p className="text-sm text-destructive xl:col-span-3">{form.formState.errors.root.message}</p>}

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg xl:col-span-3">
          <CardContent>
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              submitLabel={isEdit ? 'Save changes' : 'Create client'}
              onCancel={() => navigate('/admin/client-stories')}
              onReset={form.formState.isDirty ? () => form.reset(toFormValues(client)) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

/** Create (`/admin/client-stories/create`) and edit (`/admin/client-stories/:id/edit`) page for a client. */
export default function ClientForm() {
  const { id } = useParams()
  const isEdit = !!id
  const client = useApiQuery(() => (isEdit ? clientsApi.get(id) : Promise.resolve(null)), [id])
  // Optional lookup for the industry suggestions.
  const industries = useApiQuery(() => industriesApi.list({ per_page: 100, sort: 'sort_order' }), [])
  const record = client.data?.data

  return (
    <>
      <PageHeader
        title={isEdit ? (record ? `Edit ${record.name}` : 'Edit Client') : 'New Client'}
        description={isEdit ? 'Update the client’s logo, placement and Client Portfolio page.' : 'Add a client to the logo bar and Client Portfolio.'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/client-stories">
              <ArrowLeft /> Back to client stories
            </Link>
          </Button>
        }
      />
      {client.error ? (
        <Card>
          <ErrorState error={client.error} onRetry={client.refetch} />
        </Card>
      ) : client.isLoading || industries.isLoading ? (
        <FormSkeleton />
      ) : (
        <ClientFormBody key={record?.id ?? 'new'} client={record} industries={industries.data?.data ?? []} />
      )}
    </>
  )
}
