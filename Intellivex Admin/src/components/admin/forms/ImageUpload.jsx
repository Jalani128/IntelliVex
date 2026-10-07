import { useEffect, useId, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Common upload rules, matching the Laravel mime / max rules. */
export const IMAGE_TYPES = {
  photo: { types: ['image/jpeg', 'image/png', 'image/webp'], label: 'JPG, PNG or WebP' },
  icon: { types: ['image/png', 'image/svg+xml'], label: 'PNG or SVG' },
}

/**
 * Image picker with preview. `value` is either a URL string (existing image)
 * or a File (new upload); `onChange` receives the File or null.
 * Upload itself happens when the form is submitted (multipart to Laravel).
 * `contain` letterboxes the preview instead of cropping it — for logos and icons.
 * `types` / `typesLabel` / `maxMb` narrow what can be picked (see IMAGE_TYPES).
 * `previewClassName` replaces the preview background — e.g. the website navy for white icons.
 */
export default function ImageUpload({
  value,
  onChange,
  invalid,
  contain = false,
  types,
  typesLabel = 'PNG, JPG or WebP',
  maxMb = 5,
  className,
  previewClassName = 'bg-muted',
}) {
  const inputId = useId()
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreview(value || null)
  }, [value])

  const handleFile = (file) => {
    if (!file) return
    if (types ? !types.includes(file.type) : !file.type.startsWith('image/')) return setError(`Please choose a ${typesLabel} file.`)
    if (file.size > maxMb * 1024 * 1024) return setError(`Image must be under ${maxMb} MB.`)
    setError('')
    onChange(file)
  }

  return (
    <div className={className}>
      {preview ? (
        <div className={cn('relative overflow-hidden rounded-lg border', previewClassName)}>
          <img src={preview} alt="" className={cn('aspect-video w-full', contain ? 'object-contain p-6' : 'object-cover')} />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Remove image"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFile(e.dataTransfer.files[0])
          }}
          className={cn(
            'flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center transition-colors hover:border-primary/50 hover:bg-accent/40',
            invalid && 'border-destructive/60',
          )}
        >
          <span className="grid size-10 place-items-center rounded-full bg-accent text-primary">
            <ImagePlus className="size-5" />
          </span>
          <span className="text-sm font-medium">Click to upload or drag and drop</span>
          <span className="text-xs text-muted-foreground">
            {typesLabel} up to {maxMb} MB
          </span>
        </label>
      )}
      <input id={inputId} type="file" accept={types ? types.join(',') : 'image/*'} className="sr-only" onChange={(e) => handleFile(e.target.files[0])} />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}
