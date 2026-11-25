/** Shown while a page's CMS data loads, so the built-in content never flashes first. */
export default function PageLoader() {
  return (
    <div role="status" className="grid min-h-[70vh] place-items-center">
      <span className="size-10 animate-spin rounded-full border-2 border-cyan/20 border-t-cyan motion-reduce:animate-pulse" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
