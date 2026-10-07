import { useEffect, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { ImagePlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { RowControls } from './FormFields'

/**
 * Gallery helpers shared by content forms (products, projects, …).
 * Form value: `[{ id?, image: File | url, alt }]` — existing images keep their URL
 * in `image`, new ones hold the File.
 */

/** API record → form value. */
export const galleryValues = (gallery = []) => gallery.map(({ id, image_url, alt }) => ({ id, image: image_url, alt: alt ?? '' }))

/** Form value → payload. Kept images go back by id; new ones as files. Missing ids are deleted by the API. */
export const galleryPayload = (gallery) =>
  gallery.map((g, i) => ({
    ...(g.id != null && { id: g.id }),
    ...(g.image instanceof File && { image: g.image }),
    alt: g.alt || null,
    sort_order: i,
  }))

/** Object URL for a File, or the stored URL — cleaned up when the value changes. */
export function useImageSrc(value) {
  const [src, setSrc] = useState(null)
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setSrc(url)
      return () => URL.revokeObjectURL(url)
    }
    setSrc(value || null)
  }, [value])
  return src
}

function GalleryThumb({ image }) {
  const src = useImageSrc(image)
  return src ? <img src={src} alt="" className="aspect-video w-full rounded-md border object-cover" /> : null
}

/** Multi-image gallery: add several files at once, reorder, write alt text, remove. */
export default function GalleryField({ control, name = 'gallery', max = 8, maxMb = 3 }) {
  const gallery = useFieldArray({ control, name })
  const [error, setError] = useState('')
  const remaining = max - gallery.fields.length

  const addFiles = (files) => {
    const list = [...files]
    const valid = list.filter((f) => f.type.startsWith('image/') && f.size <= maxMb * 1024 * 1024)
    const accepted = valid.slice(0, Math.max(0, remaining))
    setError(
      valid.length < list.length
        ? `Some files were skipped — images only, up to ${maxMb} MB each.`
        : accepted.length < valid.length
          ? `Only ${max} images are allowed.`
          : '',
    )
    accepted.forEach((file) => gallery.append({ image: file, alt: '' }))
  }

  return (
    <div className="grid gap-4">
      {gallery.fields.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {gallery.fields.map((item, index) => (
            <div key={item.id} className="grid gap-2 rounded-lg border p-3">
              <GalleryThumb image={item.image} />
              <div className="flex items-start gap-2">
                <FormField
                  control={control}
                  name={`${name}.${index}.alt`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Alt text" aria-label={`Image ${index + 1} alt text`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <RowControls index={index} count={gallery.fields.length} onMove={gallery.move} onRemove={gallery.remove} label={`image ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>
      )}
      <label
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-sm transition-colors hover:border-primary/50 hover:bg-accent/40 ${remaining <= 0 ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ImagePlus className="size-4 text-primary" />
        <span className="font-medium">Add images</span>
        <span className="text-muted-foreground">
          ({gallery.fields.length} / {max})
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="sr-only"
          disabled={remaining <= 0}
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

