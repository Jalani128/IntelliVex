import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ExternalLink, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import PageHeader from '@/components/admin/layout/PageHeader'
import FormSection from '@/components/admin/forms/FormSection'
import FormActions from '@/components/admin/forms/FormActions'
import ImageUpload, { IMAGE_TYPES } from '@/components/admin/forms/ImageUpload'
import TagInput from '@/components/admin/forms/TagInput'
import GalleryField from '@/components/admin/forms/GalleryField'
import RichTextEditor from '@/components/admin/forms/RichTextEditor'
import {
  FormSkeleton,
  RowControls,
  SelectField,
  SortOrderField,
  SwitchField,
  TextField,
  nullableImageField,
} from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'
import {
  categoriesApi,
  productsApi,
  productSiteUrl,
  categoryLabel,
  categoryActive,
  IMAGE_MB,
  LIMITS,
  PUBLISH_STATUSES,
} from '@/services/admin/products'
import { SLUG_PATTERN, slugify } from '@/lib/format'

const PHOTO = IMAGE_TYPES.photo

/** Validation mirrors the Laravel rules in products-backend-spec.md. */
const schema = z
  .object({
    solution_category_id: z.string().min(1, 'Choose a category'),
    title: z.string().trim().min(1, 'Title is required').max(150, 'Max 150 characters'),
    // Optional: the API generates the slug from the title when it's empty.
    slug: z
      .string()
      .trim()
      .max(180, 'Max 180 characters')
      .refine((v) => !v || SLUG_PATTERN.test(v), 'Use lowercase letters, numbers and dashes only'),
    badge: z.string().trim().max(100, 'Max 100 characters'),
    short_description: z.string().trim().min(1, 'Short description is required').max(300, 'Max 300 characters'),
    tags: z
      .array(z.string().trim().max(LIMITS.tagLength, `Max ${LIMITS.tagLength} characters per tag`))
      .max(LIMITS.tags, `Up to ${LIMITS.tags} tags`)
      .refine((tags) => new Set(tags.map((t) => t.toLowerCase())).size === tags.length, 'Tags must be unique'),
    // The API requires the card image (and its alt text) on every product.
    image: z.any().refine((v) => !!v, 'Upload the product image'),
    image_alt: z.string().trim().min(1, 'Describe the image for screen readers').max(180, 'Max 180 characters'),
    demo_url: z
      .string()
      .trim()
      .max(2048, 'Max 2048 characters')
      .refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), 'Enter a full URL (https://…)'),
    description: z.string(),
    features: z
      .array(
        z.object({
          value: z
            .string()
            .trim()
            .min(1, 'Write the feature or remove this row')
            .max(LIMITS.featureLength, `Max ${LIMITS.featureLength} characters`),
        }),
      )
      .max(LIMITS.features, `Up to ${LIMITS.features} features`),
    images: z
      .array(z.object({ id: z.any().optional(), image: z.any(), alt: z.string().trim().max(180, 'Max 180 characters') }))
      .max(LIMITS.gallery, `Up to ${LIMITS.gallery} images`),
    is_featured: z.boolean(),
    show_in_showcase: z.boolean(),
    status: z.enum(['draft', 'published']),
    sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
  })
  .superRefine((v, ctx) => {
    if (v.images.some((g) => !g.image)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['images'], message: 'Every gallery item needs an image' })
    }
  })

const toFormValues = (p) => ({
  solution_category_id: String(p?.solution_category_id ?? p?.category?.id ?? ''),
  title: p?.title ?? '',
  slug: p?.slug ?? '',
  badge: p?.badge ?? '',
  short_description: p?.short_description ?? '',
  tags: p?.tags ?? [],
  image: p?.image_url ?? null,
  image_alt: p?.image_alt ?? '',
  demo_url: p?.demo_url ?? '',
  description: p?.description ?? '',
  features: (p?.features ?? []).map((value) => ({ value })),
  // GalleryField edits `{ id?, image: File | url, alt }`; the API uses `image_url` / `image_alt`.
  images: (p?.images ?? p?.gallery ?? []).map(({ id, image_url, image_alt }) => ({ id, image: image_url, alt: image_alt ?? '' })),
  is_featured: p?.is_featured ?? false,
  show_in_showcase: p?.show_in_showcase ?? false,
  status: p?.status ?? 'draft',
  sort_order: p?.sort_order ?? 0,
})

const emptyHtml = (html) => !html || !html.replace(/<[^>]*>|&nbsp;/g, '').trim()

const toPayload = ({ image, images, ...v }, original) => ({
  ...v,
  solution_category_id: Number(v.solution_category_id),
  slug: v.slug || null,
  badge: v.badge || null,
  demo_url: v.demo_url || null,
  description: emptyHtml(v.description) ? null : v.description,
  features: v.features.map((f) => f.value),
  // Kept items go back by id (without a file); omitted ids are deleted by the API.
  images: images.map((g, i) => ({
    ...(g.id != null && { id: g.id }),
    ...(g.image instanceof File && { image: g.image }),
    image_alt: g.alt || null,
    sort_order: i,
  })),
  ...nullableImageField('image', image, original?.image_url),
})

function ProductFormBody({ product, categories }) {
  const navigate = useNavigate()
  const isEdit = !!product
  const form = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(product) })
  const { control, setValue, getFieldState } = form
  const features = useFieldArray({ control, name: 'features' })

  const title = useWatch({ control, name: 'title' })
  const [slugTouched, setSlugTouched] = useState(isEdit)
  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(title), { shouldValidate: getFieldState('slug').isTouched })
  }, [title, slugTouched, setValue, getFieldState])

  const onSubmit = async (values) => {
    try {
      const payload = toPayload(values, product)
      if (isEdit) await productsApi.update(product.id, payload)
      else await productsApi.create(payload)
      toast.success(isEdit ? 'Product updated' : 'Product created')
      navigate('/admin/products')
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => {
        // "tags.1" / "images.0.image" → the list field (it has the message slot); feature rows have their own.
        const [root, index] = field.split('.')
        const key = root === 'features' && index != null ? `features.${index}.value` : root
        form.setError(root in values ? key : 'root', { message: messages[0] })
      })
      toast.error(err.message || 'Could not save the product')
    }
  }

  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: categoryActive(c) ? categoryLabel(c) : `${categoryLabel(c)} (hidden)`,
  }))
  const siteUrl = isEdit && product.status === 'published' ? productSiteUrl(product) : null

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => toast.error('Please fix the highlighted fields'))}
        noValidate
        className="grid items-start gap-4 sm:gap-6 xl:grid-cols-3"
      >
        {/* Main column */}
        <div className="grid gap-4 sm:gap-6 xl:col-span-2">
          <FormSection title="Basic Info" description="Name, URL and category of the product.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={control} name="title" label="Title *" max={150} placeholder="e.g. Intellivex POS" />
              <TextField control={control} name="badge" label="Badge" max={100} placeholder="e.g. SaaS" description="Small label on the card." />
            </div>
            <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <div className="flex rounded-md shadow-xs">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">/products/</span>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          setSlugTouched(true)
                          field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                        }}
                        placeholder="intellivex-pos"
                        className="rounded-l-none shadow-none"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>Product page URL. Filled from the title — leave empty to let the server generate it.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SelectField
              control={control}
              name="solution_category_id"
              label="Solution Category *"
              options={categoryOptions}
              placeholder="Choose a category"
              description="The category pill that filters the product list. Managed in the Solution Categories tab."
            />
          </FormSection>

          <FormSection title="Card" description="What the product card shows on the Products page.">
            <TextField control={control} name="short_description" label="Short Description *" max={300} multiline placeholder="One or two lines about the product." />
            <FormField
              control={control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-3">
                    <FormLabel>Tags</FormLabel>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {field.value.length} / {LIMITS.tags}
                    </span>
                  </div>
                  <FormControl>
                    <TagInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} max={LIMITS.tags} maxLength={LIMITS.tagLength} />
                  </FormControl>
                  <FormDescription>Press Enter or comma after each tag. Shown as pills on the card.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField
              control={control}
              name="demo_url"
              label="Demo URL"
              max={2048}
              placeholder="https://demo.intellivex.com/pos"
              description="“VIEW DEMO” button. Empty = the button opens the product page."
            />
          </FormSection>

          <FormSection title="Detail Page" description="Optional — content for /products/{slug}.">
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="Introduction on the product page — paragraphs, lists and links are supported."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Features</p>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {features.fields.length} / {LIMITS.features}
                </span>
              </div>
              {features.fields.length === 0 && <p className="text-sm text-muted-foreground">No features yet.</p>}
              {features.fields.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="mt-2 w-5 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{index + 1}.</span>
                  <FormField
                    control={control}
                    name={`features.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="e.g. Offline mode" aria-label={`Feature ${index + 1}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <RowControls index={index} count={features.fields.length} onMove={features.move} onRemove={features.remove} label={`feature ${index + 1}`} />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-self-start"
                disabled={features.fields.length >= LIMITS.features}
                onClick={() => features.append({ value: '' })}
              >
                <Plus /> Add feature
              </Button>
            </div>
            <FormField
              control={control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Gallery</FormLabel>
                  <GalleryField control={control} name="images" max={LIMITS.gallery} maxMb={IMAGE_MB.gallery} />
                  <FormDescription>{PHOTO.label} up to {IMAGE_MB.gallery} MB each. Shown on the product page.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
        </div>

        {/* Side column */}
        <div className="grid gap-4 sm:gap-6">
          <FormSection title="Card Image *" description={`Screenshot or mockup, ${PHOTO.label} up to ${IMAGE_MB.card} MB.`}>
            <FormField
              control={control}
              name="image"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="sr-only">Card Image</FormLabel>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!fieldState.error}
                    types={PHOTO.types}
                    typesLabel={PHOTO.label}
                    maxMb={IMAGE_MB.card}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField control={control} name="image_alt" label="Image Alt Text *" max={180} placeholder="Describe the image" />
          </FormSection>

          <FormSection title="Where to Show" description="Sections of the Products page this card appears in (published products only).">
            <SwitchField control={control} name="is_featured" label="Featured Products" description={`Up to ${LIMITS.featured} published products.`} />
            <SwitchField control={control} name="show_in_showcase" label="Product Showcase" description={`Up to ${LIMITS.showcase} published products.`} />
          </FormSection>

          <FormSection title="Visibility">
            <SelectField control={control} name="status" label="Status *" options={PUBLISH_STATUSES} description="Only published products show on the website." />
            <SortOrderField control={control} />
            {siteUrl && (
              <Button variant="outline" size="sm" asChild className="justify-self-start">
                <a href={siteUrl} target="_blank" rel="noreferrer">
                  <ExternalLink /> View on website
                </a>
              </Button>
            )}
          </FormSection>
        </div>

        {form.formState.errors.root && <p className="text-sm text-destructive xl:col-span-3">{form.formState.errors.root.message}</p>}

        <Card className="sticky bottom-4 z-10 py-4 shadow-lg xl:col-span-3">
          <CardContent>
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              submitLabel={isEdit ? 'Save changes' : 'Create product'}
              onCancel={() => navigate('/admin/products')}
              onReset={form.formState.isDirty ? () => form.reset(toFormValues(product)) : undefined}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

/** Create (`/admin/products/create`) and edit (`/admin/products/:id/edit`) page. */
export default function ProductForm() {
  const { id } = useParams()
  const isEdit = !!id
  const product = useApiQuery(() => (isEdit ? productsApi.get(id) : Promise.resolve(null)), [id])
  const categories = useApiQuery(() => categoriesApi.list({ per_page: 100, sort: 'sort_order' }), [])

  const record = product.data?.data
  const error = product.error || categories.error

  return (
    <>
      <PageHeader
        title={isEdit ? (record ? `Edit ${record.title}` : 'Edit Product') : 'New Product'}
        description={isEdit ? 'Update the product card and its detail page.' : 'Add a product to the website.'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/products">
              <ArrowLeft /> Back to products
            </Link>
          </Button>
        }
      />
      {error ? (
        <Card>
          <ErrorState
            error={error}
            onRetry={() => {
              product.refetch()
              categories.refetch()
            }}
          />
        </Card>
      ) : product.isLoading || categories.isLoading ? (
        <FormSkeleton />
      ) : (
        <ProductFormBody key={record?.id ?? 'new'} product={record} categories={categories.data?.data ?? []} />
      )}
    </>
  )
}
