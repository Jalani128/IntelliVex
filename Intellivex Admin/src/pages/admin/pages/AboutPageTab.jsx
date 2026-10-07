import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { SITE_NAVY_BG } from '@/lib/utils'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormSection from '@/components/admin/forms/FormSection'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import { SelectField, TextField, imageField } from '@/components/admin/forms/FormFields'
import {
  CtaFields,
  HeadingBlock,
  ParagraphsField,
  SaveBar,
  TextListField,
  ctaSchema,
  fromTextRows,
  headingSchema,
  nullEmpty,
  optionalText,
  requiredText,
  textListSchema,
  toTextRows,
} from '@/components/admin/content/PageContentFields'
import { aboutPageApi, PROCESS_STEPS } from '@/services/admin/pages'
import PageContentLoader from './PageContentLoader'

const RATINGS = ['5', '4', '3', '2', '1'].map((value) => ({ value, label: `${value} star${value === '1' ? '' : 's'}` }))

/** Title + highlight + text of a plate such as "Our Vision". */
const plateSchema = (prefix) => ({
  [`${prefix}_title`]: requiredText(100, 'Title'),
  [`${prefix}_highlight`]: optionalText(50),
  [`${prefix}_description`]: requiredText(1000, 'Text'),
})

/** Validation mirrors `about_page` in docs/pages-content-backend-spec.md. */
const schema = z.object({
  ...headingSchema('overview'),
  overview_description: requiredText(5000, 'Paragraphs'),
  ...plateSchema('partners'),
  partners_rating: z.string(),
  partners_logo: z.any(),
  ...plateSchema('vision'),
  ...plateSchema('mission'),
  ...headingSchema('process'),
  process_description: optionalText(1000),
  process_steps: z
    .array(z.object({ title: requiredText(80, 'Step title'), description: requiredText(300, 'Step text') }))
    .length(PROCESS_STEPS, `The timeline has ${PROCESS_STEPS} steps`),
  ...headingSchema('differentiators'),
  differentiators_description: optionalText(1000),
  differentiators_items: textListSchema('point'),
  ...ctaSchema,
})

const SPECIAL = ['partners_rating', 'partners_logo', 'process_steps', 'differentiators_items']
const TEXT_FIELDS = Object.keys(schema.shape).filter((k) => !SPECIAL.includes(k))

const toFormValues = (page) => ({
  ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, page[key] ?? ''])),
  partners_rating: String(page.partners_rating ?? 5),
  partners_logo: page.partners_logo_url ?? null,
  process_steps: Array.from({ length: PROCESS_STEPS }, (_, i) => ({
    title: page.process_steps?.[i]?.title ?? '',
    description: page.process_steps?.[i]?.description ?? '',
  })),
  differentiators_items: toTextRows(page.differentiators_items),
})

/** Title + Highlight + Text for one plate. */
function PlateFields({ control, prefix, textLabel = 'Text *' }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField control={control} name={`${prefix}_title`} label="Title *" max={100} description="The whole heading." />
        <TextField control={control} name={`${prefix}_highlight`} label="Highlight" max={50} description="Part of the title shown in the gradient." />
      </div>
      <TextField control={control} name={`${prefix}_description`} label={textLabel} max={1000} multiline rows={3} />
    </>
  )
}

function AboutPageForm({ page, onSaved }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(page) })
  const { control } = form

  const onSubmit = async ({ partners_rating, partners_logo, differentiators_items, process_steps, ...values }) => {
    try {
      await aboutPageApi.update({
        ...nullEmpty(values),
        partners_rating: Number(partners_rating),
        process_steps: process_steps.map((s, i) => ({ ...s, sort_order: i })),
        differentiators_items: fromTextRows(differentiators_items),
        ...imageField('partners_logo', partners_logo, page.partners_logo_url),
      })
      toast.success('About Us page updated')
      onSaved()
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field, { message: messages[0] }))
      toast.error(err.message || 'Could not save the page')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))} noValidate className="grid gap-4 sm:gap-6">
        <FormSection title="1 · Company Overview" description="Opening section of the About Us page.">
          <HeadingBlock control={control} prefix="overview" />
          <ParagraphsField control={control} name="overview_description" />
        </FormSection>

        <FormSection title="2 · Trusted Partners Card" description="The card beside the overview text.">
          <PlateFields control={control} prefix="partners" />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField control={control} name="partners_rating" label="Star Rating" options={RATINGS} />
            <FormField
              control={control}
              name="partners_logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <ImageUpload value={field.value} onChange={field.onChange} types={IMAGE_TYPES.icon.types} typesLabel={IMAGE_TYPES.icon.label} maxMb={1} contain previewClassName={SITE_NAVY_BG} className="max-w-xs" />
                  <FormDescription>Shown 24 px tall under the stars.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="3 · Our Vision & Our Mission" description="The two wide plates under the overview.">
          <p className="text-sm font-medium">Vision</p>
          <PlateFields control={control} prefix="vision" />
          <p className="pt-2 text-sm font-medium">Mission</p>
          <PlateFields control={control} prefix="mission" />
        </FormSection>

        <FormSection title="4 · How We Deliver" description="Process timeline. It is drawn for three steps; “STEP 1–3” labels are added by the website.">
          <HeadingBlock control={control} prefix="process" />
          <TextField control={control} name="process_description" label="Intro" max={1000} multiline rows={3} />
          {Array.from({ length: PROCESS_STEPS }, (_, i) => (
            <div key={i} className="grid gap-3 rounded-lg border p-4">
              <span className="text-sm font-medium">Step {i + 1}</span>
              <TextField control={control} name={`process_steps.${i}.title`} label="Title *" max={80} />
              <TextField control={control} name={`process_steps.${i}.description`} label="Text *" max={300} multiline rows={2} />
            </div>
          ))}
        </FormSection>

        <FormSection title="5 · Key Differentiators" description="Heading, intro and checklist points on the About Us page.">
          <HeadingBlock control={control} prefix="differentiators" />
          <TextField control={control} name="differentiators_description" label="Intro" max={1000} multiline rows={3} />
          <div className="grid gap-2">
            <p className="text-sm font-medium">Points *</p>
            <TextListField control={control} name="differentiators_items" label="point" placeholder="e.g. AI-first thinking built into every solution." />
          </div>
        </FormSection>

        <FormSection title="6 · CTA Banner" description="“Reimagine your business” banner at the bottom of the About Us page.">
          <CtaFields control={control} />
        </FormSection>

        <SaveBar form={form} page={page} onReset={() => form.reset(toFormValues(page))} />
      </form>
    </Form>
  )
}

export default function AboutPageTab() {
  return <PageContentLoader api={aboutPageApi} Form={AboutPageForm} />
}
