import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormDescription, FormItem, FormLabel } from '@/components/ui/form'
import PageHeader from '@/components/admin/layout/PageHeader'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import { FormSkeleton, TextField } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { studioContactApi, studioHomeApi, studioProfileApi } from '@/services/admin/studio'

const PHOTO = IMAGE_TYPES.photo
const LOREM = 'Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng'
const phone = z.string().trim().refine((v) => !v || /^[0-9+\-().\s]{7,30}$/.test(v), 'Enter a valid phone number')

/**
 * Field = [key, label, default (what the website shows when empty), options].
 * Keys must match Studio*PageRequest::contentFields() in the API, which rejects any other key.
 */
export const STUDIO_PAGES = {
  home: {
    title: 'Home Page',
    description: 'Hero slides and call to action on the Game Studio home page. Stats are edited on Our Studio.',
    api: studioHomeApi,
    sections: [
      ...[0, 1, 2].map((i) => ({
        title: `Hero Slide ${i + 1}`,
        fields: [
          [`hero_${i}_eyebrow`, 'Eyebrow', 'Game development studio'],
          ...['Create.', 'Play.', 'Experience.'].map((text, n) => [`hero_${i}_line_${n}`, `Heading line ${n + 1}`, text]),
          [`hero_${i}_text`, 'Description', i === 2 ? '' : 'Our team consists of highly skilled professionals who have a deep understanding of the game development.', { multiline: true }],
        ],
      })),
      {
        title: 'Call to Action',
        description: 'The banner above the footer.',
        fields: [
          ['cta_title', 'Title', 'Turn Your Game Idea Into Reality'],
          ['cta_text', 'Description', 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer', { multiline: true }],
        ],
      },
    ],
    images: [0, 1, 2].map((i) => [`hero_${i}`, `Hero slide ${i + 1}`]),
  },
  about: {
    title: 'Our Studio Page',
    description: 'About text, vision and mission, and the studio stats.',
    api: studioProfileApi,
    sections: [
      {
        title: 'About',
        fields: [
          ['about_title_0', 'Title line 1', 'We Build Platforms'],
          ['about_title_1', 'Title line 2', 'That Empower Gamers'],
          ['about_text', 'Description', `${LOREM} Duis eletum sollicitudin is yaugue euismods. Lorem`, { multiline: true, max: 5000 }],
        ],
      },
      {
        title: 'Vision & Mission',
        fields: [
          ['vision_0_text', 'Our vision', LOREM, { multiline: true, max: 5000 }],
          ['vision_1_text', 'Our mission', LOREM, { multiline: true, max: 5000 }],
        ],
      },
      {
        title: 'Stats',
        description: 'Shown on this page and on the Home page.',
        columns: 2,
        fields: [['10+', 'Games in Development'], ['50+', 'Talented Creators'], ['06+', 'Platforms'], ['Global', 'Audience Focused']].flatMap(([value, label], i) => [
          [`stat_${i}_value`, `Stat ${i + 1} value`, value],
          [`stat_${i}_label`, `Stat ${i + 1} label`, label],
        ]),
      },
    ],
    images: [['image', 'Main studio image']],
  },
  contact: {
    title: 'Contact Page',
    description: 'Studio address and contact details.',
    api: studioContactApi,
    sections: [
      {
        title: 'Address',
        fields: [
          ['address_0', 'Address line 1', 'AZ1025, BAKI ŞƏHƏRİ XƏTAİ RAYONU,'],
          ['address_1', 'Address line 2', '8 NOYABR, ev.15, AZURE BUSİNESS CENTER, m. 165B'],
          ['map_url', 'Map link', 'https://www.google.com/maps/search/?api=1&query=Azure+Business+Center+Baku', { max: 2048, rule: z.string().trim().url('Enter a full URL (https://…)') }],
        ],
      },
      {
        title: 'Contact Details',
        columns: 2,
        fields: [
          ['email', 'Email', 'info@intellivexstudios.com', { rule: z.string().trim().email('Enter a valid email') }],
          ['phone_0', 'Phone 1', '+994 10 243 9644', { rule: phone }],
          ['phone_1', 'Phone 2', '+994 10 243 9645', { rule: phone }],
        ],
      },
    ],
    images: [['image', 'Map image', 'Links to the map above. Update it when the address changes.']],
  },
}

function ImageSlot({ api, slot, label, hint, url, onSaved }) {
  const [uploading, setUploading] = useState(false)
  const upload = async (file) => {
    if (!file) return // the API can't remove page images, only replace them
    setUploading(true)
    try {
      onSaved(await api.upload(slot, file))
      toast.success(`${label} saved`)
    } catch (err) {
      toast.error(err.errors?.image?.[0] ?? err.message ?? 'Could not upload the image')
    } finally {
      setUploading(false)
    }
  }
  return (
    <FormItem>
      <FormLabel className="flex items-center gap-2">
        {label} {uploading && <Loader2 className="size-3.5 animate-spin" />}
      </FormLabel>
      <ImageUpload value={url ?? null} onChange={upload} types={PHOTO.types} typesLabel={PHOTO.label} />
      <FormDescription>{hint ?? 'Saved as soon as you pick it. Choose another image to replace it.'}</FormDescription>
    </FormItem>
  )
}

function PageContentBody({ config, page }) {
  const fields = config.sections.flatMap((s) => s.fields)
  const toForm = (content) => Object.fromEntries(fields.map(([key, , fallback]) => [key, content?.[key] ?? fallback]))
  const schema = z.object(
    Object.fromEntries(fields.map(([key, , , opts = {}]) => {
      const max = opts.max ?? 1000
      const rule = opts.rule ? z.union([z.literal(''), opts.rule]) : z.string()
      return [key, rule.refine((v) => v.length <= max, `Max ${max} characters`)]
    })),
  )
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toForm(page.content) })
  const [images, setImages] = useState(page.images)

  const onSubmit = async (values) => {
    try {
      const saved = await config.api.save(values)
      form.reset(toForm(saved.content))
      toast.success(`${config.title} saved`)
    } catch (err) {
      const errors = Object.entries(err.errors ?? {})
      errors.forEach(([field, messages]) => {
        const key = field.replace(/^content\./, '')
        if (key in values) form.setError(key, { message: messages[0] }, { shouldFocus: true })
      })
      toast.error(errors.length ? 'Please fix the highlighted fields' : err.message || 'Could not save the page')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))}
        noValidate
        className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3"
      >
        <div className="grid gap-4 sm:gap-6 xl:col-span-2">
          {config.sections.map((section) => (
            <FormSection key={section.title} title={section.title} description={section.description}>
              <div className={section.columns === 2 ? 'grid gap-5 sm:grid-cols-2' : 'grid gap-5'}>
                {section.fields.map(([key, label, , opts = {}]) => (
                  <TextField key={key} control={form.control} name={key} label={label} multiline={opts.multiline} rows={4} max={opts.multiline ? opts.max ?? 1000 : undefined} />
                ))}
              </div>
            </FormSection>
          ))}
        </div>

        <div className="grid gap-4 sm:gap-6">
          <FormSection title="Images" description="JPG, PNG or WebP up to 5 MB.">
            {config.images.map(([slot, label, hint]) => (
              <ImageSlot key={slot} api={config.api} slot={slot} label={label} hint={hint} url={images[slot]} onSaved={(saved) => setImages(saved.images)} />
            ))}
          </FormSection>
        </div>

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg xl:col-span-3">
          <CardContent>
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              submitLabel="Save changes"
              onReset={form.formState.isDirty ? () => form.reset() : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

/** Single-row page content for the Game Studio website (Home, Our Studio, Contact). */
export default function StudioPageContent({ page }) {
  const config = STUDIO_PAGES[page]
  const query = useApiQuery(() => config.api.get(), [page])

  return (
    <>
      <PageHeader title={config.title} description={config.description} />
      {query.error ? (
        <Card>
          <ErrorState error={query.error} onRetry={query.refetch} />
        </Card>
      ) : query.isLoading ? (
        <FormSkeleton />
      ) : (
        <PageContentBody key={page} config={config} page={query.data} />
      )}
    </>
  )
}
