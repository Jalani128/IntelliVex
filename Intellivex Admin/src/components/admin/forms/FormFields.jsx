import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

/**
 * Field building blocks shared by the full-page content forms (Services, Industries, …).
 * All of them expect to sit inside a react-hook-form <Form>.
 */

/** New file → upload it; cleared existing image → ask the API to remove it; unchanged → send nothing. */
export const imageField = (field, value, originalUrl) => {
  if (value instanceof File) return { [field]: value }
  if (!value && originalUrl) return { [`remove_${field}`]: true }
  return {}
}

/**
 * Same, for APIs (Portfolio, Products) that clear an image when the field is sent
 * empty and ignore `remove_{field}`. Leaving the field out keeps the image.
 */
export const nullableImageField = (field, value, originalUrl) => {
  if (value instanceof File) return { [field]: value }
  if (!value && originalUrl) return { [field]: null }
  return {}
}


/** "12 / 300" under length-limited fields. */
export function Counter({ value = '', max }) {
  const len = value.length
  return <span className={cn('text-xs tabular-nums', len > max ? 'text-destructive' : 'text-muted-foreground')}>{len} / {max}</span>
}

export function TextField({ control, name, label, description, max, placeholder, multiline, rows = 3 }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        // content-start: side-by-side fields keep their inputs aligned even when only one has a description.
        <FormItem className="content-start">
          <div className="flex items-center justify-between gap-3">
            <FormLabel>{label}</FormLabel>
            {max && <Counter value={field.value} max={max} />}
          </div>
          <FormControl>
            {multiline ? (
              <Textarea {...field} rows={rows} placeholder={placeholder} />
            ) : (
              <Input {...field} placeholder={placeholder} />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function SwitchField({ control, name, label, description }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-start justify-between gap-4 rounded-lg border p-3.5">
          <div className="grid gap-1">
            <FormLabel className="cursor-pointer">{label}</FormLabel>
            <FormDescription className="text-xs">{description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} onBlur={field.onBlur} name={field.name} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

/** Up / down / remove buttons for a repeater row. */
export function RowControls({ index, count, onMove, onRemove, label }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button type="button" variant="ghost" size="icon-sm" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label={`Move ${label} up`}>
        <ArrowUp />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label={`Move ${label} down`}>
        <ArrowDown />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" onClick={() => onRemove(index)} aria-label={`Remove ${label}`} className="text-destructive hover:text-destructive">
        <Trash2 />
      </Button>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
      <div className="grid gap-4 sm:gap-6 xl:col-span-2">
        {[0, 1].map((i) => (
          <Card key={i}>
            <CardContent className="grid gap-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="grid gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}


/** Single-choice dropdown. `options` = [{ value, label }]. */
export function SelectField({ control, name, label, options, description, placeholder }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="content-start">
          <FormLabel>{label}</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function SortOrderField({ control, name = 'sort_order', description = 'Lower numbers show first.', className = 'w-32' }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="content-start">
          <FormLabel>Sort Order</FormLabel>
          <FormControl>
            <Input {...field} type="number" min={0} step={1} className={className} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

/**
 * Eyebrow + Title + Highlight (+ text after the highlight) — the heading
 * pattern every website section uses. Field names are `{prefix}_eyebrow`, …
 */
export function HeadingFields({ control, prefix, tail = false }) {
  return (
    <div className={cn('grid gap-5', tail ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3')}>
      <TextField control={control} name={`${prefix}_eyebrow`} label="Eyebrow *" max={50} />
      <TextField control={control} name={`${prefix}_title`} label="Title *" max={100} />
      <TextField control={control} name={`${prefix}_highlight`} label="Highlight" max={50} description="Gradient text." />
      {tail && <TextField control={control} name={`${prefix}_title_tail`} label="After highlight" max={50} />}
    </div>
  )
}
