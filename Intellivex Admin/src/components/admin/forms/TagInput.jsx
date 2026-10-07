import { forwardRef, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Chips input for short string lists (product tags, …).
 * Enter or comma adds the typed tag, Backspace on an empty box removes the last one.
 * Duplicates (case-insensitive) and blanks are ignored; `max` caps the count
 * and `maxLength` the length of each tag.
 */
const TagInput = forwardRef(function TagInput(
  { value = [], onChange, onBlur, max = 10, maxLength = 30, placeholder = 'Type and press Enter', id, className, ...aria },
  ref,
) {
  const [draft, setDraft] = useState('')
  const full = value.length >= max

  /** Adds each non-blank, not-yet-present tag until `max` is reached. */
  const addMany = (raws) => {
    const next = [...value]
    raws.forEach((raw) => {
      const tag = raw.trim().slice(0, maxLength)
      if (tag && next.length < max && !next.some((t) => t.toLowerCase() === tag.toLowerCase())) next.push(tag)
    })
    if (next.length !== value.length) onChange(next)
  }

  const add = (raw) => {
    setDraft('')
    addMany([raw])
  }

  // Typing a comma — or pasting "a, b, c" — turns every finished part into a tag.
  const handleChange = (text) => {
    if (!text.includes(',')) return setDraft(text)
    const parts = text.split(',')
    setDraft(parts.pop())
    addMany(parts)
  }

  const remove = (index) => onChange(value.filter((_, i) => i !== index))

  return (
    <div
      className={cn(
        'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30',
        className,
      )}
      aria-invalid={aria['aria-invalid']}
    >
      {value.map((tag, i) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-accent py-0.5 pr-1 pl-2 text-xs font-medium text-primary">
          {tag}
          <button
            type="button"
            onClick={() => remove(i)}
            className="grid size-4 place-items-center rounded hover:bg-primary/15"
            aria-label={`Remove ${tag}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        ref={ref}
        id={id}
        value={draft}
        disabled={full}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            add(draft)
          } else if (e.key === 'Backspace' && !draft && value.length) {
            remove(value.length - 1)
          }
        }}
        onBlur={(e) => {
          if (draft) add(draft)
          onBlur?.(e)
        }}
        placeholder={full ? `Max ${max} tags` : placeholder}
        maxLength={maxLength}
        className="min-w-24 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        aria-describedby={aria['aria-describedby']}
      />
    </div>
  )
})

export default TagInput
