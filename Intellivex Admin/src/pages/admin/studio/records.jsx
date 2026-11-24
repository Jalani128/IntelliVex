import { z } from 'zod'
import { BriefcaseBusiness, Gamepad2, Handshake, MessageSquareQuote, Newspaper, Users } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormSection from '@/components/admin/forms/FormSection'
import { TextField } from '@/components/admin/forms/FormFields'
import { SLUG_PATTERN } from '@/lib/format'
import {
  studioGamesApi,
  studioJobsApi,
  studioMembersApi,
  studioNewsApi,
  studioPartnersApi,
  studioReviewsApi,
} from '@/services/admin/studio'

/**
 * Game Studio record types, rendered by StudioRecordList / StudioRecordForm.
 * Schemas mirror the Laravel Studio*Request rules; status, sort order and the image are added by the form.
 */

const text = (max) => z.string().trim().max(max, `Max ${max} characters`)
const required = (max, label) => text(max).min(1, `${label} is required`)
const slug = text(180).refine((v) => !v || SLUG_PATTERN.test(v), 'Use lowercase letters, numbers and dashes only')
const url = text(2048).refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), 'Enter a full URL (https://…)')
const lines = (maxItems, maxLength) =>
  z.string().refine((v) => toLines(v).length <= maxItems, `Up to ${maxItems} lines`).refine((v) => toLines(v).every((l) => l.length <= maxLength), `Each line can have up to ${maxLength} characters`)

const toLines = (value) => value.split('\n').map((l) => l.trim()).filter(Boolean)
/** Form values → API payload: blank optional text becomes null, a blank slug is left for the API to generate. */
const clean = (values) => ({
  ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value === '' ? null : value])),
  slug: values.slug || undefined,
})
const pick = (record, keys) => Object.fromEntries(keys.map((key) => [key, record?.[key] ?? '']))

function DateField({ control, name, label, description }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="content-start">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} type="date" className="w-44" />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function CheckboxGroup({ control, name, label, options, description }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {options.map(([value, optionLabel]) => (
              <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={field.value.includes(value)}
                  onCheckedChange={(checked) => field.onChange(checked ? [...field.value, value] : field.value.filter((v) => v !== value))}
                />
                {optionLabel}
              </label>
            ))}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SlugField = ({ control, from }) => (
  <TextField control={control} name="slug" label="Slug" max={180} description={`Used in the page URL. Leave empty to generate it from the ${from}.`} />
)

const PLATFORMS = [['mobile', 'Mobile'], ['pc', 'PC'], ['console', 'Console']]
const CATEGORIES = [['mobile', 'Mobile'], ['web', 'Web'], ['pc', 'PC'], ['console', 'Console'], ['cloud', 'Cloud'], ['immersive', 'Immersive']]

const GAME_TEXT = ['title', 'slug', 'genre', 'description', 'features_intro', 'downloads', 'rating', 'reviews', 'download_url']

export const games = {
  key: 'games',
  path: '/admin/studio/games',
  title: 'Games',
  singular: 'Game',
  icon: Gamepad2,
  description: 'Games shown on the Game Studio website.',
  formDescription: 'Game details shown on its card and its own page.',
  api: studioGamesApi,
  label: (r) => r.title,
  subtitle: (r) => r.genre,
  thumb: 'cover',
  sortable: true,
  searchable: true,
  image: { title: 'Artwork', label: 'Cover image', description: 'Shown on the game card and at the top of the game page.' },
  errorKeys: { features: 'featuresText' },
  schema: z.object({
    title: required(150, 'Title'),
    slug,
    genre: text(150),
    description: text(20000),
    features_intro: text(5000),
    featuresText: lines(30, 500),
    platforms: z.array(z.string()),
    categories: z.array(z.string()),
    downloads: text(50),
    rating: text(50),
    reviews: text(50),
    download_url: url,
  }),
  toForm: (r) => ({ ...pick(r, GAME_TEXT), featuresText: (r?.features ?? []).join('\n'), platforms: r?.platforms ?? [], categories: r?.categories ?? [] }),
  toPayload: ({ featuresText, ...v }) => ({ ...clean(v), features: toLines(featuresText) }),
  Main: ({ control }) => (
    <>
      <FormSection title="Basic Info">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField control={control} name="title" label="Title *" max={150} placeholder="e.g. Neon Drift" />
          <TextField control={control} name="genre" label="Genre" max={150} placeholder="e.g. Racing" />
        </div>
        <SlugField control={control} from="title" />
      </FormSection>
      <FormSection title="About the Game">
        <TextField control={control} name="description" label="Description" multiline rows={5} />
        <TextField control={control} name="features_intro" label="Features introduction" multiline />
        <TextField control={control} name="featuresText" label="Features" multiline rows={5} description="One feature per line." />
      </FormSection>
      <FormSection title="Platforms">
        <CheckboxGroup control={control} name="platforms" label="Platform icons" options={PLATFORMS} description="Icons shown on the game card." />
        <CheckboxGroup control={control} name="categories" label="Listed under" options={CATEGORIES} description="Filters on the Games page." />
      </FormSection>
    </>
  ),
  Side: ({ control }) => (
    <FormSection title="Store Details" description="Optional numbers shown on the game page.">
      <div className="grid grid-cols-3 gap-3">
        <TextField control={control} name="downloads" label="Downloads" placeholder="1M+" />
        <TextField control={control} name="rating" label="Rating" placeholder="4.6" />
        <TextField control={control} name="reviews" label="Reviews" placeholder="12K" />
      </div>
      <TextField control={control} name="download_url" label="Download link" placeholder="https://…" />
    </FormSection>
  ),
}

export const news = {
  key: 'news',
  path: '/admin/studio/news',
  title: 'News',
  singular: 'Article',
  icon: Newspaper,
  description: 'Articles shown on the Game Studio website.',
  formDescription: 'An article on the News page.',
  api: studioNewsApi,
  label: (r) => r.title,
  subtitle: (r) => r.excerpt,
  thumb: 'cover',
  searchable: true,
  dateColumn: { key: 'published_at', header: 'Published' },
  image: { title: 'Image', label: 'Article image', description: 'Shown on the news card and above the article.' },
  errorKeys: { body: 'bodyText' },
  schema: z.object({
    title: required(150, 'Title'),
    slug,
    excerpt: text(1000),
    bodyText: lines(100, 10000),
    published_at: z.string(),
  }),
  refine: (v, ctx) => {
    if (v.status === 'published' && !v.published_at)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['published_at'], message: 'Published articles need a date' })
  },
  toForm: (r) => ({ ...pick(r, ['title', 'slug', 'excerpt']), published_at: r?.published_at?.slice(0, 10) ?? '', bodyText: (r?.body ?? []).join('\n\n') }),
  toPayload: ({ bodyText, ...v }) => ({ ...clean(v), body: bodyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) }),
  Main: ({ control }) => (
    <>
      <FormSection title="Basic Info">
        <TextField control={control} name="title" label="Title *" max={150} />
        <div className="grid gap-5 sm:grid-cols-2">
          <SlugField control={control} from="title" />
          <DateField control={control} name="published_at" label="Publication date" description="Required to publish." />
        </div>
        <TextField control={control} name="excerpt" label="Excerpt" max={1000} multiline description="Short summary on the news card." />
      </FormSection>
      <FormSection title="Article">
        <TextField control={control} name="bodyText" label="Text" multiline rows={12} description="Separate paragraphs with a blank line." />
      </FormSection>
    </>
  ),
}

const JOB_TEXT = ['title', 'slug', 'category', 'summary', 'description', 'requirements', 'why_join', 'salary', 'employment_type', 'location', 'experience', 'work_mode']

export const careers = {
  key: 'careers',
  path: '/admin/studio/careers',
  title: 'Careers',
  singular: 'Role',
  icon: BriefcaseBusiness,
  description: 'Open roles on the Game Studio website. Applications arrive under Studio Leads.',
  formDescription: 'An open role on the Careers page.',
  api: studioJobsApi,
  label: (r) => r.title,
  subtitle: (r) => [r.category, r.location].filter(Boolean).join(' · '),
  searchable: true,
  dateColumn: { key: 'posted_at', header: 'Posted' },
  errorKeys: { perks: 'perksText' },
  schema: z.object({
    title: required(150, 'Title'),
    slug,
    category: required(150, 'Category'),
    summary: text(1000),
    description: text(20000),
    requirements: text(20000),
    why_join: text(20000),
    perksText: lines(50, 500),
    salary: text(150),
    employment_type: text(150),
    location: text(150),
    experience: text(150),
    work_mode: text(150),
    posted_at: z.string(),
  }),
  toForm: (r) => ({ ...pick(r, JOB_TEXT), posted_at: r?.posted_at?.slice(0, 10) ?? '', perksText: (r?.perks ?? []).join('\n') }),
  toPayload: ({ perksText, ...v }) => ({ ...clean(v), perks: toLines(perksText) }),
  Main: ({ control }) => (
    <>
      <FormSection title="Basic Info">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField control={control} name="title" label="Title *" max={150} placeholder="e.g. Unity Developer" />
          <TextField control={control} name="category" label="Category *" max={150} placeholder="e.g. Engineering" />
        </div>
        <SlugField control={control} from="title" />
        <TextField control={control} name="summary" label="Summary" max={1000} multiline description="Shown on the role card." />
      </FormSection>
      <FormSection title="Role Description">
        <TextField control={control} name="description" label="About the role" multiline rows={5} />
        <TextField control={control} name="requirements" label="Requirements" multiline rows={5} />
        <TextField control={control} name="why_join" label="Why join" multiline rows={4} />
        <TextField control={control} name="perksText" label="Benefits" multiline rows={4} description="One benefit per line." />
      </FormSection>
    </>
  ),
  Side: ({ control }) => (
    <FormSection title="Role Details">
      <TextField control={control} name="employment_type" label="Employment type" placeholder="Full-time" />
      <TextField control={control} name="work_mode" label="Work mode" placeholder="Hybrid" />
      <TextField control={control} name="location" label="Location" placeholder="Baku" />
      <TextField control={control} name="experience" label="Experience" placeholder="2+ years" />
      <TextField control={control} name="salary" label="Salary" />
      <DateField control={control} name="posted_at" label="Posted date" />
    </FormSection>
  ),
}

const person = ({ key, title, singular, icon, description, api, roleLabel, quote, image }) => ({
  key,
  path: `/admin/studio/${key}`,
  title,
  singular,
  icon,
  description,
  formDescription: description,
  api,
  label: (r) => r.name,
  subtitle: (r) => r.role,
  thumb: image.contain ? 'logo' : 'cover',
  sortable: true,
  image,
  schema: z.object({
    name: required(150, 'Name'),
    ...(roleLabel && { role: text(150) }),
    ...(quote && { quote: required(5000, 'Quote') }),
  }),
  toForm: (r) => pick(r, ['name', ...(roleLabel ? ['role'] : []), ...(quote ? ['quote'] : [])]),
  toPayload: (v) => clean(v),
  Main: ({ control }) => (
    <FormSection title="Details">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField control={control} name="name" label="Name *" max={150} />
        {roleLabel && <TextField control={control} name="role" label={roleLabel} max={150} />}
      </div>
      {quote && <TextField control={control} name="quote" label="Quote *" max={5000} multiline rows={5} />}
    </FormSection>
  ),
})

const PORTRAIT = { title: 'Photo', label: 'Portrait', description: 'Square photos work best.' }

export const team = person({
  key: 'team',
  title: 'Team',
  singular: 'Team Member',
  icon: Users,
  description: 'Team members on the Our Studio page.',
  api: studioMembersApi,
  roleLabel: 'Role',
  image: PORTRAIT,
})

export const testimonials = person({
  key: 'testimonials',
  title: 'Testimonials',
  singular: 'Testimonial',
  icon: MessageSquareQuote,
  description: 'Client quotes on the Our Studio page.',
  api: studioReviewsApi,
  roleLabel: 'Company / role',
  quote: true,
  image: PORTRAIT,
})

export const partners = person({
  key: 'partners',
  title: 'Partners',
  singular: 'Partner',
  icon: Handshake,
  description: 'Partner logos in the scrolling strip on the Game Studio website.',
  api: studioPartnersApi,
  image: { title: 'Logo', label: 'Logo', description: 'A transparent PNG or WebP looks best.', contain: true, required: true },
})

export const STUDIO_RECORDS = Object.fromEntries([games, news, careers, team, testimonials, partners].map((config) => [config.key, config]))
