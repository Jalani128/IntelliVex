import { Loader2 } from 'lucide-react'

/** Fallback while a lazily-loaded page chunk downloads. */
export default function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center text-muted-foreground" role="status" aria-label="Loading page">
      <Loader2 className="size-6 animate-spin" />
    </div>
  )
}
