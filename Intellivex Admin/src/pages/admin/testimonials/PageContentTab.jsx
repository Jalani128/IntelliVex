import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import { FormSkeleton, HeadingFields, TextField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { formatDate } from '@/lib/format'
import { testimonialsPageApi } from '@/services/admin/testimonials'

const required = (max, label) => z.string().trim().min(1, `${label} is required`).max(max, `Max ${max} characters`)
const optional = (max) => z.string().trim().max(max, `Max ${max} characters`)

/** Validation mirrors `testimonials_page` in docs/testimonials-backend-spec. */
const schema = z.object({
  portfolio_eyebrow: required(50, 'Eyebrow'),
  portfolio_title: required(100, 'Title'),
  portfolio_highlight: optional(50),
  portfolio_description: optional(2000),
  reviews_eyebrow: required(50, 'Eyebrow'),
  reviews_title: required(100, 'Title'),
  reviews_highlight: optional(50),
  reviews_limit: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(1, 'At least 1').max(9, 'Up to 9'),
  stories_eyebrow: required(50, 'Eyebrow'),
  stories_title: required(100, 'Title'),
  stories_highlight: optional(50),
  cta_title_line1: required(100, 'Title line 1'),
  cta_title_line2: optional(100),
  cta_description: optional(2000),
  cta_button_label: required(50, 'Button label'),
  cta_button_link: required(255, 'Button link').refine(
    (v) => v.startsWith('/') || /^https?:\/\//.test(v),
    'Use a site path like /contact or a full URL',
  ),
  meta_title: optional(70),
  meta_description: optional(160),
})

const FIELDS = Object.keys(schema.shape)
const toFormValues = (page) => Object.fromEntries(FIELDS.map((key) => [key, page[key] ?? '']))

function PageContentForm({ page, onSaved }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(page) })
  const { control } = form

  const onSubmit = async (values) => {
    const payload = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === '' ? null : v]))
    try {
      await testimonialsPageApi.update(payload)
      toast.success('Testimonials page updated')
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
        <FormSection title="1 · Client Portfolio" description="Heading and text above the client logo grid. Logos are managed in the Clients tab.">
          <HeadingFields control={control} prefix="portfolio" />
          <TextField
            control={control}
            name="portfolio_description"
            label="Description"
            max={2000}
            multiline
            rows={5}
            description="Leave a blank line between paragraphs."
          />
        </FormSection>

        <FormSection title="2 · Real Reviews" description="Heading above the review cards. Reviews are managed in the Reviews tab.">
          <HeadingFields control={control} prefix="reviews" />
          <FormField
            control={control}
            name="reviews_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cards to show</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={1} max={9} step={1} className="w-32" />
                </FormControl>
                <FormDescription>The design shows 3 cards in a row.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="3 · Success Stories" description="Heading above the story cards. Stories are managed in the Success Stories tab.">
          <HeadingFields control={control} prefix="stories" />
        </FormSection>

        <FormSection title="4 · CTA Banner" description="“Ready to discuss your Industry Requirements?” banner at the bottom.">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="cta_title_line1" label="Title Line 1 *" max={100} />
            <TextField control={control} name="cta_title_line2" label="Title Line 2" max={100} />
          </div>
          <TextField control={control} name="cta_description" label="Description" max={2000} multiline rows={3} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="cta_button_label" label="Button Label *" max={50} />
            <TextField control={control} name="cta_button_link" label="Button Link *" max={255} placeholder="/contact" />
          </div>
        </FormSection>

        <FormSection title="SEO" description="Search and social sharing for /testimonials.">
          <TextField control={control} name="meta_title" label="Meta Title" max={70} />
          <TextField control={control} name="meta_description" label="Meta Description" max={160} multiline rows={2} />
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
  const query = useApiQuery(() => testimonialsPageApi.get(), [])
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
