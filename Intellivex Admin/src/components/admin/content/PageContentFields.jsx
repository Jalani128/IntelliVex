import { useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import FormActions from '@/components/admin/forms/FormActions'
import { RowControls, TextField } from '@/components/admin/forms/FormFields'
import { formatDate } from '@/lib/format'

/**
 * Pieces shared by the single-row page content forms (Home, About Us, Services page).
 * Field names follow the page-content API: `{section}_eyebrow`, `{section}_title`, …
 */

export const requiredText = (max, label) => z.string().trim().min(1, `${label} is required`).max(max, `Max ${max} characters`)
export const optionalText = (max) => z.string().trim().max(max, `Max ${max} characters`)

/** Site path or full URL, as the other page-content forms accept it. */
export const linkText = (label) =>
  requiredText(255, label).refine((v) => v.startsWith('/') || /^https?:\/\//.test(v), 'Use a site path like /contact or a full URL')

/** Heading block: Eyebrow + Title (whole heading) + Highlight (gradient phrase inside it). */
export const headingSchema = (prefix) => ({
  [`${prefix}_eyebrow`]: requiredText(50, 'Eyebrow'),
  [`${prefix}_title`]: requiredText(150, 'Title'),
  [`${prefix}_highlight`]: optionalText(100),
})

export function HeadingBlock({ control, prefix }) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <TextField control={control} name={`${prefix}_eyebrow`} label="Eyebrow *" max={50} />
      <TextField control={control} name={`${prefix}_title`} label="Title *" max={150} description="The whole heading." />
      <TextField control={control} name={`${prefix}_highlight`} label="Highlight" max={100} description="Part of the title shown in the gradient." />
    </div>
  )
}

export const ctaSchema = {
  cta_title_line1: requiredText(100, 'Title line 1'),
  cta_title_line2: optionalText(100),
  cta_description: optionalText(500),
  cta_button_label: requiredText(50, 'Button label'),
  cta_button_link: linkText('Button link'),
}

export function CtaFields({ control }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField control={control} name="cta_title_line1" label="Title Line 1 *" max={100} />
        <TextField control={control} name="cta_title_line2" label="Title Line 2" max={100} />
      </div>
      <TextField control={control} name="cta_description" label="Description" max={500} multiline rows={3} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField control={control} name="cta_button_label" label="Button Label *" max={50} />
        <TextField control={control} name="cta_button_link" label="Button Link *" max={255} placeholder="/contact" />
      </div>
    </>
  )
}

/** Paragraphs are stored as one text; a blank line starts a new paragraph on the website. */
export function ParagraphsField({ control, name, label = 'Paragraphs *', max = 5000 }) {
  return (
    <TextField
      control={control}
      name={name}
      label={label}
      max={max}
      multiline
      rows={9}
      description="Leave a blank line between paragraphs."
    />
  )
}

/** List of short texts (e.g. differentiator points) — the form holds [{ text }], the API a string array. */
export const textListSchema = (label, max = 200) =>
  z.array(z.object({ text: z.string().trim().min(1, `Write the ${label} or remove this row`).max(max, `Max ${max} characters`) })).min(1, `Add at least one ${label}`)

export const toTextRows = (list) => (list ?? []).map((text) => ({ text }))
export const fromTextRows = (rows) => rows.map((r) => r.text)

export function TextListField({ control, name, label, placeholder, max = 200 }) {
  const list = useFieldArray({ control, name })
  return (
    <div className="grid gap-3">
      {list.fields.length === 0 && <p className="text-sm text-muted-foreground">No {label}s yet.</p>}
      {list.fields.map((item, index) => (
        <div key={item.id} className="flex items-start gap-2">
          <span className="mt-2 w-5 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{index + 1}.</span>
          <FormField
            control={control}
            name={`${name}.${index}.text`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} maxLength={max} placeholder={placeholder} aria-label={`${label} ${index + 1}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <RowControls index={index} count={list.fields.length} onMove={list.move} onRemove={list.remove} label={`${label} ${index + 1}`} />
        </div>
      ))}
      <FormField control={control} name={name} render={() => <FormMessage />} />
      <Button type="button" variant="outline" size="sm" className="justify-self-start" onClick={() => list.append({ text: '' })}>
        <Plus /> Add {label}
      </Button>
    </div>
  )
}

/** Empty strings go to the API as null, like the other page-content forms. */
export const nullEmpty = (values) => Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === '' ? null : v]))

/** Sticky save bar with the last-saved date. */
export function SaveBar({ form, page, onReset }) {
  return (
    <Card className="sticky bottom-4 z-10 py-4 shadow-lg">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Last saved {formatDate(page.updated_at)}</p>
        <FormActions
          isSubmitting={form.formState.isSubmitting}
          submitLabel="Save page"
          onReset={form.formState.isDirty ? onReset : undefined}
        />
      </CardContent>
    </Card>
  )
}
