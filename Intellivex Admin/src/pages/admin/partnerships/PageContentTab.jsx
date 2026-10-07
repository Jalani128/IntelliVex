import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload from '@/components/admin/forms/ImageUpload'
import { FormSkeleton, HeadingFields, TextField, imageField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { formatDate } from '@/lib/format'
import { partnershipsPageApi } from '@/services/admin/partnerships'

const required = (max, label) => z.string().trim().min(1, `${label} is required`).max(max, `Max ${max} characters`)
const optional = (max) => z.string().trim().max(max, `Max ${max} characters`)
const link = (label) =>
  required(255, label).refine((v) => v.startsWith('/') || /^https?:\/\//.test(v), 'Use a site path like /contact or a full URL')

/** Validation mirrors `partnerships_page` in docs/partnerships-backend-spec. */
const schema = z.object({
  intro_eyebrow: required(50, 'Eyebrow'),
  intro_title: required(100, 'Title'),
  intro_highlight: optional(50),
  intro_title_tail: optional(50),
  intro_description: optional(1000),
  intro_button_label: required(50, 'Button label'),
  intro_button_link: link('Button link'),
  strategic_eyebrow: required(50, 'Eyebrow'),
  strategic_title: required(100, 'Title'),
  strategic_highlight: optional(50),
  strategic_description: optional(1000),
  integration_eyebrow: required(50, 'Eyebrow'),
  integration_title: required(100, 'Title'),
  integration_highlight: optional(50),
  video_eyebrow: required(50, 'Eyebrow'),
  video_title: required(100, 'Title'),
  video_highlight: optional(50),
  video_url: optional(500).refine((v) => !v || /^https?:\/\//.test(v), 'Enter a full URL (https://…)'),
  video_thumbnail: z.any(),
  video_thumbnail_alt: optional(150),
  platforms_eyebrow: required(50, 'Eyebrow'),
  platforms_title: required(100, 'Title'),
  platforms_highlight: optional(50),
  platforms_button_label: required(50, 'Button label'),
  platforms_button_link: link('Button link'),
  cta_title_line1: required(100, 'Title line 1'),
  cta_title_line2: optional(100),
  cta_description: optional(1000),
  cta_button_label: required(50, 'Button label'),
  cta_button_link: link('Button link'),
  meta_title: optional(70),
  meta_description: optional(160),
})

const FIELDS = Object.keys(schema.shape)

const toFormValues = (page) =>
  Object.fromEntries(
    FIELDS.map((key) => [key, key === 'video_thumbnail' ? (page.video_thumbnail_url ?? null) : (page[key] ?? '')]),
  )

function PageContentForm({ page, onSaved }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(page) })
  const { control } = form

  const onSubmit = async (values) => {
    const { video_thumbnail, ...rest } = values
    const payload = {
      ...Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, v === '' ? null : v])),
      ...imageField('video_thumbnail', video_thumbnail, page.video_thumbnail_url),
    }
    try {
      await partnershipsPageApi.update(payload)
      toast.success('Partnerships page updated')
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
        <FormSection title="1 · Overview" description="“Passion and innovation Shape our Journey” — first section under the page header.">
          <HeadingFields control={control} prefix="intro" tail />
          <TextField control={control} name="intro_description" label="Description" max={1000} multiline rows={4} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="intro_button_label" label="Button Label *" max={50} />
            <TextField control={control} name="intro_button_link" label="Button Link *" max={255} placeholder="/contact" />
          </div>
        </FormSection>

        <FormSection title="2 · Technology & Strategic Partners" description="Heading and text above the Strategic logo row. Logos are managed in the Partners tab.">
          <HeadingFields control={control} prefix="strategic" />
          <TextField control={control} name="strategic_description" label="Description" max={1000} multiline rows={4} />
        </FormSection>

        <FormSection title="3 · Partner / Integration Logos" description="Heading above the 3 × 2 logo grid. Logos are managed in the Partners tab.">
          <HeadingFields control={control} prefix="integration" />
        </FormSection>

        <FormSection title="4 · Technology Integrations" description="Video box with a play button.">
          <HeadingFields control={control} prefix="video" />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="grid content-start gap-5">
              <TextField
                control={control}
                name="video_url"
                label="Video URL"
                max={500}
                placeholder="https://www.youtube.com/watch?v=…"
                description="YouTube, Vimeo or an MP4 link. Opens when the play button is clicked."
              />
              <TextField control={control} name="video_thumbnail_alt" label="Thumbnail Alt Text" max={150} />
            </div>
            <FormField
              control={control}
              name="video_thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Thumbnail</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} />
                  <FormDescription>JPG, PNG or WebP, up to 3 MB.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="5 · Platforms & Technologies Supported" description="Heading and button above the platform cards. Cards are managed in the Supported Platforms tab.">
          <HeadingFields control={control} prefix="platforms" />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="platforms_button_label" label="Button Label *" max={50} />
            <TextField control={control} name="platforms_button_link" label="Button Link *" max={255} placeholder="/services" />
          </div>
        </FormSection>

        <FormSection title="6 · CTA Banner" description="“Become a Partner or Discuss Integration” banner at the bottom.">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="cta_title_line1" label="Title Line 1 *" max={100} />
            <TextField control={control} name="cta_title_line2" label="Title Line 2" max={100} />
          </div>
          <TextField control={control} name="cta_description" label="Description" max={1000} multiline rows={3} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="cta_button_label" label="Button Label *" max={50} />
            <TextField control={control} name="cta_button_link" label="Button Link *" max={255} placeholder="/contact" />
          </div>
        </FormSection>

        <FormSection title="SEO" description="Search and social sharing for /partnerships.">
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
  const query = useApiQuery(() => partnershipsPageApi.get(), [])
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
