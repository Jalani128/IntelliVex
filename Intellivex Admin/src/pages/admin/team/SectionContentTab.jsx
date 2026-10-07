import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import { FormSkeleton, SwitchField, TextField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { teamSectionApi } from '@/services/admin/team'

const required = (max, label) => z.string().trim().min(1, `${label} is required`).max(max, `Max ${max} characters`)

/** Validation mirrors `team_section` in TEAM_API.md — all six fields are required on PUT. */
const schema = z.object({
  eyebrow: required(100, 'Eyebrow'),
  title: required(200, 'Title'),
  highlight: required(100, 'Highlight'),
  show_view_all: z.boolean(),
  view_all_label: required(80, 'Button label'),
  view_all_url: required(2048, 'Button link').refine(
    (v) => v.startsWith('/') || /^https?:\/\//.test(v),
    'Use a site path like /contact or a full URL',
  ),
})

const FIELDS = Object.keys(schema.shape)
const toFormValues = (section) => Object.fromEntries(FIELDS.map((key) => [key, section[key] ?? (key === 'show_view_all' ? true : '')]))

function SectionForm({ section, onSaved }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(section) })
  const { control } = form
  const [title, highlight] = useWatch({ control, name: ['title', 'highlight'] })
  const highlightOutside = highlight.trim() && title.trim() && !title.toLowerCase().includes(highlight.trim().toLowerCase())

  const onSubmit = async (values) => {
    try {
      await teamSectionApi.update(values)
      toast.success('Leadership section updated')
      onSaved()
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field, { message: messages[0] }))
      toast.error(err.message || 'Could not save the section')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))} noValidate className="grid gap-4 sm:gap-6">
        <FormSection title="Heading" description="“Our Leadership” heading on the About page. Members are managed in the Team Members tab.">
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField control={control} name="eyebrow" label="Eyebrow *" max={100} />
            <TextField control={control} name="title" label="Title *" max={200} />
            <TextField
              control={control}
              name="highlight"
              label="Highlight *"
              max={100}
              description={highlightOutside ? 'Not found in the title — it will be added after it.' : 'Words of the title shown in gradient.'}
            />
          </div>
        </FormSection>

        <FormSection title="VIEW ALL Button" description="Button to the right of the heading.">
          <SwitchField control={control} name="show_view_all" label="Show button" description="Hide it to show the heading on its own." />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={control} name="view_all_label" label="Button Label *" max={80} />
            <TextField control={control} name="view_all_url" label="Button Link *" placeholder="/contact" description="A site path like /contact, or a full URL." />
          </div>
        </FormSection>

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg">
          <CardContent>
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              submitLabel="Save section"
              onReset={form.formState.isDirty ? () => form.reset(toFormValues(section)) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

export default function SectionContentTab() {
  const query = useApiQuery(() => teamSectionApi.get(), [])
  const section = query.data?.data

  if (query.error) {
    return (
      <Card>
        <ErrorState error={query.error} onRetry={query.refetch} />
      </Card>
    )
  }
  if (!section) return <FormSkeleton />
  // Remount with the saved values after each save (the section has no `updated_at`).
  return <SectionForm key={JSON.stringify(section)} section={section} onSaved={query.refetch} />
}
