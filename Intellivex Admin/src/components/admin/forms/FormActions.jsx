import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/** Cancel / Reset / Submit row shared by every admin form. */
export default function FormActions({ isSubmitting, submitLabel = 'Save', onCancel, onReset, className }) {
  return (
    <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end', className)}>
      {onCancel && (
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      )}
      {onReset && (
        <Button type="button" variant="outline" onClick={onReset} disabled={isSubmitting}>
          Reset
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting} className="min-w-28">
        {isSubmitting && <Loader2 className="animate-spin" />}
        {isSubmitting ? 'Saving…' : submitLabel}
      </Button>
    </div>
  )
}
