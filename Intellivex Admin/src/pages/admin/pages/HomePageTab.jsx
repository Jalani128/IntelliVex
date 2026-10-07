import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Form } from '@/components/ui/form'
import FormSection from '@/components/admin/forms/FormSection'
import { TextField } from '@/components/admin/forms/FormFields'
import {
  CtaFields,
  HeadingBlock,
  SaveBar,
  TextListField,
  ctaSchema,
  fromTextRows,
  headingSchema,
  nullEmpty,
  optionalText,
  textListSchema,
  toTextRows,
} from '@/components/admin/content/PageContentFields'
import { homePageApi } from '@/services/admin/pages'
import PageContentLoader from './PageContentLoader'

/** Validation mirrors `home_page` in docs/pages-content-backend-spec.md. */
const schema = z.object({
  ...headingSchema('differentiators'),
  differentiators_description: optionalText(1000),
  differentiators_items: textListSchema('point'),
  ...headingSchema('services'),
  ...ctaSchema,
})

const TEXT_FIELDS = Object.keys(schema.shape).filter((k) => k !== 'differentiators_items')

const toFormValues = (page) => ({
  ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, page[key] ?? ''])),
  differentiators_items: toTextRows(page.differentiators_items),
})

function HomePageForm({ page, onSaved }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(page) })
  const { control } = form

  const onSubmit = async ({ differentiators_items, ...values }) => {
    try {
      await homePageApi.update({ ...nullEmpty(values), differentiators_items: fromTextRows(differentiators_items) })
      toast.success('Home page updated')
      onSaved()
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field, { message: messages[0] }))
      toast.error(err.message || 'Could not save the page')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))} noValidate className="grid gap-4 sm:gap-6">
        <FormSection title="1 · Key Differentiators" description="Heading, intro and the checklist points below the Home hero.">
          <HeadingBlock control={control} prefix="differentiators" />
          <TextField control={control} name="differentiators_description" label="Intro" max={1000} multiline rows={3} />
          <div className="grid gap-2">
            <p className="text-sm font-medium">Points *</p>
            <TextListField control={control} name="differentiators_items" label="point" placeholder="e.g. AI-first thinking built into every solution." />
          </div>
        </FormSection>

        <FormSection
          title="2 · Our Services"
          description="Heading above the three service cards. The cards are the services marked “Featured on Home” in the Services module."
        >
          <HeadingBlock control={control} prefix="services" />
        </FormSection>

        <FormSection title="3 · CTA Banner" description="“Reimagine your business” banner on the Home page.">
          <CtaFields control={control} />
        </FormSection>

        <SaveBar form={form} page={page} onReset={() => form.reset(toFormValues(page))} />
      </form>
    </Form>
  )
}

export default function HomePageTab() {
  return <PageContentLoader api={homePageApi} Form={HomePageForm} />
}
