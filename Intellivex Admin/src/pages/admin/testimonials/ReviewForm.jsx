import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import PageHeader from '@/components/admin/layout/PageHeader'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload from '@/components/admin/forms/ImageUpload'
import { FormSkeleton, SelectField, SortOrderField, SwitchField, TextField, imageField } from '@/components/admin/forms/FormFields'
import StarRating from '@/components/admin/common/StarRating'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { clientsApi, reviewsApi, reviewRole, LIMITS, PUBLISH_STATUSES } from '@/services/admin/testimonials'
import { initials } from '@/lib/format'

const NO_CLIENT = 'none'

/** Validation mirrors the Laravel rules in docs/testimonials-backend-spec. */
const schema = z.object({
  client_name: z.string().trim().min(1, 'Client name is required').max(100, 'Max 100 characters'),
  designation: z.string().trim().min(1, 'Designation is required').max(100, 'Max 100 characters'),
  company: z.string().trim().max(150, 'Max 150 characters'),
  quote: z.string().trim().min(10, 'Write at least 10 characters').max(500, 'Max 500 characters'),
  rating: z.number({ invalid_type_error: 'Pick a rating' }).int().min(1, 'Pick a rating').max(5),
  avatar: z.any(),
  client_id: z.string(),
  status: z.enum(['draft', 'published']),
  show_on_home: z.boolean(),
  show_on_testimonials_page: z.boolean(),
  sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
})

const toFormValues = (r) => ({
  client_name: r?.client_name ?? '',
  designation: r?.designation ?? '',
  company: r?.company ?? '',
  quote: r?.quote ?? '',
  rating: r?.rating ?? 5,
  avatar: r?.avatar_url ?? null,
  client_id: r?.client_id ? String(r.client_id) : NO_CLIENT,
  status: r?.status ?? 'draft',
  show_on_home: r?.show_on_home ?? false,
  show_on_testimonials_page: r?.show_on_testimonials_page ?? true,
  sort_order: r?.sort_order ?? 0,
})

const toPayload = ({ avatar, ...v }, original) => ({
  ...v,
  company: v.company || null,
  client_id: v.client_id === NO_CLIENT ? null : Number(v.client_id),
  ...imageField('avatar', avatar, original?.avatar_url),
})

/** Same layout as the website's review card, so the admin sees what they'll get. */
function ReviewPreview({ control }) {
  const [name, designation, company, quote, rating, avatar] = useWatch({
    control,
    name: ['client_name', 'designation', 'company', 'quote', 'rating', 'avatar'],
  })
  const [avatarUrl, setAvatarUrl] = useState(null)
  useEffect(() => {
    if (avatar instanceof File) {
      const url = URL.createObjectURL(avatar)
      setAvatarUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setAvatarUrl(avatar || null)
  }, [avatar])

  return (
    <div className="rounded-xl bg-navy-deep p-5 text-white shadow-inner">
      <StarRating value={rating} size="size-4" />
      <p className="mt-3 min-h-16 text-sm leading-relaxed text-white/80">{quote || 'The review text appears here.'}</p>
      <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-sm font-semibold">
          {avatarUrl ? <img src={avatarUrl} alt="" className="size-full object-cover" /> : initials(name) || '?'}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name || 'Client name'}</p>
          <p className="truncate text-xs text-white/60">{reviewRole({ designation, company }) || 'Designation'}</p>
        </div>
      </div>
    </div>
  )
}

function ReviewFormBody({ review, clients }) {
  const navigate = useNavigate()
  const isEdit = !!review
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(review) })
  const { control } = form

  const onSubmit = async (values) => {
    try {
      const payload = toPayload(values, review)
      if (isEdit) await reviewsApi.update(review.id, payload)
      else await reviewsApi.create(payload)
      toast.success(isEdit ? 'Review updated' : 'Review created')
      navigate('/admin/testimonials')
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field, { message: messages[0] }))
      toast.error(err.message || 'Could not save the review')
    }
  }

  const clientOptions = [{ value: NO_CLIENT, label: 'None' }, ...clients.map((c) => ({ value: String(c.id), label: c.name }))]

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))}
        noValidate
        className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3"
      >
        {/* Main column */}
        <div className="grid gap-4 sm:gap-6 xl:col-span-2">
          <FormSection title="Client" description="Who gave the review — shown under the quote.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="client_name" label="Client Name *" max={100} placeholder="e.g. Sarah Mitchell" />
              <TextField control={control} name="designation" label="Designation / Role *" max={100} placeholder="e.g. CEO" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="company" label="Company" max={150} placeholder="e.g. Brightline Health" description="Shown after the role: “CEO, Brightline Health”." />
              <SelectField control={control} name="client_id" label="Client Company (link)" options={clientOptions} description="Optional — links the review to a client in the Clients tab." />
            </div>
          </FormSection>

          <FormSection title="Review">
            <FormField
              control={control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating *</FormLabel>
                  <StarRating value={field.value} onChange={field.onChange} size="size-6" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField control={control} name="quote" label="Review / Quote *" max={500} multiline rows={5} placeholder="What the client said about working with Intellivex." />
          </FormSection>
        </div>

        {/* Side column */}
        <div className="grid gap-4 sm:gap-6">
          <FormSection title="Preview" description="How the card looks on the website.">
            <ReviewPreview control={control} />
          </FormSection>

          <FormSection title="Photo" description="Optional — without a photo the card shows the client’s initials.">
            <FormField
              control={control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Photo</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} />
                  <FormDescription>Square JPG, PNG or WebP, up to 1 MB.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Visibility & Flags">
            <SelectField control={control} name="status" label="Status *" options={PUBLISH_STATUSES} description="Only published reviews show on the website." />
            <SwitchField control={control} name="show_on_home" label="Show on Home page" description={`“Real Reviews” on the home page (up to ${LIMITS.home}).`} />
            <SwitchField control={control} name="show_on_testimonials_page" label="Show on Testimonials page" description="“Real Reviews” on /testimonials." />
            <SortOrderField control={control} />
          </FormSection>
        </div>

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg xl:col-span-3">
          <CardContent>
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              submitLabel={isEdit ? 'Save changes' : 'Create review'}
              onCancel={() => navigate('/admin/testimonials')}
              onReset={form.formState.isDirty ? () => form.reset(toFormValues(review)) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

/** Create (`/admin/testimonials/create`) and edit (`/admin/testimonials/:id/edit`) page for one review. */
export default function ReviewForm() {
  const { id } = useParams()
  const isEdit = !!id
  const review = useApiQuery(() => (isEdit ? reviewsApi.get(id) : Promise.resolve(null)), [id])
  const clients = useApiQuery(() => clientsApi.list({ per_page: 200, sort: 'name' }), [])

  const record = review.data?.data
  const error = review.error || clients.error

  return (
    <>
      <PageHeader
        title={isEdit ? (record ? `Edit review — ${record.client_name}` : 'Edit Review') : 'New Review'}
        description={isEdit ? 'Update this client review.' : 'Add a client review to the website.'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/testimonials">
              <ArrowLeft /> Back to testimonials
            </Link>
          </Button>
        }
      />
      {error ? (
        <Card>
          <ErrorState
            error={error}
            onRetry={() => {
              review.refetch()
              clients.refetch()
            }}
          />
        </Card>
      ) : review.isLoading || clients.isLoading ? (
        <FormSkeleton />
      ) : (
        <ReviewFormBody key={record?.id ?? 'new'} review={record} clients={clients.data?.data ?? []} />
      )}
    </>
  )
}
