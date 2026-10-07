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
import { teamMembersApi, FEATURED_LIMIT, SOCIAL_FIELDS, TEAM_LIMITS as MAX, TEAM_STATUSES } from '@/services/admin/team'
import { SLUG_PATTERN, slugify } from '@/lib/format'

const PHOTO = IMAGE_TYPES.photo

const socialUrl = z
  .string()
  .trim()
  .max(MAX.url, `Max ${MAX.url} characters`)
  .refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), 'Enter a full URL (https://…)')

/**
 * Validation mirrors the Laravel rules for /api/admin/team-members (TEAM_API.md),
 * so every field the API requires is checked — and highlighted — before the form is sent.
 */
const schema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(MAX.name, `Max ${MAX.name} characters`),
    // Optional: the API generates the slug from the name when it's empty.
    slug: z
      .string()
      .trim()
      .max(MAX.slug, `Max ${MAX.slug} characters`)
      .refine((v) => !v || SLUG_PATTERN.test(v), 'Use lowercase letters, numbers and dashes only'),
    designation: z.string().trim().min(1, 'Designation is required').max(MAX.designation, `Max ${MAX.designation} characters`),
    photo: z.any(),
    photo_alt: z.string().trim().max(MAX.photoAlt, `Max ${MAX.photoAlt} characters`),
    facebook_url: socialUrl,
    instagram_url: socialUrl,
    linkedin_url: socialUrl,
    is_featured: z.boolean(),
    status: z.enum(['draft', 'published']),
    sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
  })
  .superRefine((v, ctx) => {
    if (v.photo && !v.photo_alt)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['photo_alt'], message: 'Photo alt text is required when a photo is present' })
  })

const toFormValues = (m) => ({
  name: m?.name ?? '',
  slug: m?.slug ?? '',
  designation: m?.designation ?? '',
  photo: m?.photo_url ?? null,
  photo_alt: m?.photo_alt ?? '',
  facebook_url: m?.facebook_url ?? '',
  instagram_url: m?.instagram_url ?? '',
  linkedin_url: m?.linkedin_url ?? '',
  is_featured: m?.is_featured ?? false,
  status: m?.status ?? 'draft',
  sort_order: m?.sort_order ?? 0,
})

const toPayload = ({ photo, ...v }, original) => ({
  ...v,
  // Blank → leave it out, so the API generates it from the name (or keeps the current one).
  slug: v.slug || undefined,
  photo_alt: photo ? v.photo_alt : null,
  facebook_url: v.facebook_url || null,
  instagram_url: v.instagram_url || null,
  linkedin_url: v.linkedin_url || null,
  // New file → upload; cleared → `photo: null` (JSON) removes it; unchanged → not sent.
  ...nullableImageField('photo', photo, original?.photo_url),
})

function TeamMemberFormBody({ member }) {
  const navigate = useNavigate()
  const isEdit = !!member
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(member) })
  const { control, setValue, getFieldState } = form

  // Slug and photo alt text follow the name until they're edited by hand (new members only).
  const [name, photo] = useWatch({ control, name: ['name', 'photo'] })
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [altTouched, setAltTouched] = useState(isEdit && !!member.photo_alt)
  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(name), { shouldValidate: getFieldState('slug').isTouched })
    if (!altTouched) setValue('photo_alt', name.trim() ? `${name.trim()} portrait` : '', { shouldValidate: getFieldState('photo_alt').isTouched })
  }, [name, slugTouched, altTouched, setValue, getFieldState])

  const onSubmit = async (values) => {
    try {
      const payload = toPayload(values, member)
      const saved = isEdit ? await teamMembersApi.update(member.id, payload) : await teamMembersApi.create(payload)
      toast.success(isEdit ? 'Team member updated' : 'Team member created')
      navigate(saved?.data?.id ? `/admin/team/${saved.data.id}` : '/admin/team')
    } catch (err) {
      // Any rule only the server knows (unique slug, featured limit…) still lands on its field.
      const errors = Object.entries(err.errors ?? {})
      errors.forEach(([field, messages]) => {
        const key = field.split('.')[0]
        if (key in values) form.setError(key, { message: messages[0] }, { shouldFocus: true })
      })
      toast.error(errors.length ? 'Please fix the highlighted fields' : err.message || 'Could not save the team member')
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
          <FormSection title="Basic Info" description="Shown on the member’s card in the “Our Leadership” section.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="name" label="Name *" max={MAX.name} placeholder="e.g. Maya Patel" />
              <TextField control={control} name="designation" label="Designation *" max={MAX.designation} placeholder="e.g. Chief Executive Officer" />
            </div>
            <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setSlugTouched(true)
                        field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                      }}
                      placeholder="maya-patel"
                      maxLength={MAX.slug}
                    />
                  </FormControl>
                  <FormDescription>Unique identifier. Filled from the name — leave empty to let the server generate it.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Social Links" description="Optional — only the profiles you add appear as icons on the card.">
            {SOCIAL_FIELDS.map(({ name: field, label, placeholder }) => (
              <TextField key={field} control={control} name={field} label={label} placeholder={placeholder} />
            ))}
          </FormSection>
        </div>

        {/* Side column */}
        <div className="grid gap-4 sm:gap-6">
          <FormSection title="Photo" description="Square portrait works best — it’s shown in a circle.">
            <FormField
              control={control}
              name="photo"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Portrait</FormLabel>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!fieldState.error}
                    types={PHOTO.types}
                    typesLabel={PHOTO.label}
                    maxMb={MAX.photoMb}
                  />
                  <FormDescription>Without a photo, the website shows the member’s initials.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="photo_alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo Alt Text {photo && '*'}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setAltTouched(true)
                        field.onChange(e)
                      }}
                      placeholder="e.g. Maya Patel portrait"
                      maxLength={MAX.photoAlt}
                    />
                  </FormControl>
                  <FormDescription>Describes the photo for screen readers. Required with a photo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Visibility">
            <SelectField
              control={control}
              name="status"
              label="Status *"
              options={TEAM_STATUSES}
              description="Only published members can show on the website."
            />
            <SwitchField
              control={control}
              name="is_featured"
              label="Featured"
              description={`Show in the “Our Leadership” row (published only, up to ${FEATURED_LIMIT}).`}
            />
            <SortOrderField control={control} />
          </FormSection>
        </div>

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg xl:col-span-3">
          <CardContent>
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              submitLabel={isEdit ? 'Save changes' : 'Create team member'}
              onCancel={() => navigate(isEdit ? `/admin/team/${member.id}` : '/admin/team')}
              onReset={form.formState.isDirty ? () => form.reset(toFormValues(member)) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

/** Create (`/admin/team/create`) and edit (`/admin/team/:id/edit`) page for one team member. */
export default function TeamMemberForm() {
  const { id } = useParams()
  const isEdit = !!id
  const query = useApiQuery(() => (isEdit ? teamMembersApi.get(id) : Promise.resolve(null)), [id])
  const record = query.data?.data

  return (
    <>
      <PageHeader
        title={isEdit ? (record ? `Edit ${record.name}` : 'Edit Team Member') : 'New Team Member'}
        description={isEdit ? 'Update this team member’s details.' : 'Add a team member to the website’s “Our Leadership” section.'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/team">
              <ArrowLeft /> Back to team
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
        <TeamMemberFormBody key={record?.id ?? 'new'} member={record} />
      )}
    </>
  )
}
