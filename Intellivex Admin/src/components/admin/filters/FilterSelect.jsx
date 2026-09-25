import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

/**
 * Single-value filter dropdown. `options` = [{ value, label }].
 * The "all" option clears the filter.
 */
export default function FilterSelect({ value = 'all', onChange, options, allLabel = 'All', label, className }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn('w-full bg-card sm:w-[160px]', className)} aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
