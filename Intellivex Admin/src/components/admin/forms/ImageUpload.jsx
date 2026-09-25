import { useEffect, useId, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_MB = 5

/**
 * Image picker with preview. `value` is either a URL string (existing image)
 * or a File (new upload); `onChange` receives the File or null.
 * Upload itself happens when the form is submitted (multipart to Laravel).
 */
export default function ImageUpload({ value, onChange, invalid, className }) {
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
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.')
    if (file.size > MAX_MB * 1024 * 1024) return setError(`Image must be under ${MAX_MB} MB.`)
    setError('')
    onChange(file)
  }

  return (
    <div className={className}>
      {preview ? (
        <div className="relative overflow-hidden rounded-lg border bg-muted">
          <img src={preview} alt="" className="aspect-video w-full object-cover" />
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
          <span className="text-xs text-muted-foreground">PNG, JPG or WebP up to {MAX_MB} MB</span>
        </label>
      )}
      <input id={inputId} type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files[0])} />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}
