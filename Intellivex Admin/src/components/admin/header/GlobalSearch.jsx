import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { NAV_ITEMS, RESOURCE_MODULES } from '../sidebar/nav-config'

const COMMANDS = [
  ...NAV_ITEMS.map((item) => ({ id: item.key, group: 'Pages', label: item.label, path: item.path, icon: item.icon })),
  ...RESOURCE_MODULES.filter((m) => m.crud !== false).map((m) => ({
    id: `${m.key}-create`,
    group: 'Quick actions',
    label: `New ${m.singular}`,
    path: `${m.path}/create`,
    icon: Plus,
  })),
]

/** Ctrl/⌘ + K command palette for jumping between admin pages. */
export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef(null)
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? COMMANDS.filter((c) => c.label.toLowerCase().includes(q)) : COMMANDS
  }, [query])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => setActive(0), [query])
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (cmd) => {
    if (!cmd) return
    setOpen(false)
    navigate(cmd.path)
  }

  const onInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[active])
    }
  }

  let lastGroup = null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 max-md:w-9 max-md:justify-center max-md:px-0 md:w-64"
        aria-label="Search"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left max-md:hidden">Search…</span>
        <kbd className="rounded border border-border bg-muted px-1.5 font-sans text-[11px] font-medium max-md:hidden">Ctrl K</kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="top-[15%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">Search admin</DialogTitle>
          <DialogDescription className="sr-only">Jump to a page or start a quick action.</DialogDescription>
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search pages and actions…"
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              role="combobox"
              aria-expanded="true"
              aria-controls="global-search-results"
            />
          </div>
          <ul id="global-search-results" ref={listRef} role="listbox" className="scrollbar-thin max-h-80 overflow-y-auto p-2">
            {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">No results for “{query}”.</li>}
            {results.map((cmd, i) => {
              const Icon = cmd.icon
              const header = cmd.group !== lastGroup
              lastGroup = cmd.group
              return (
                <li key={cmd.id}>
                  {header && <p className="px-3 pt-2 pb-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{cmd.group}</p>}
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    data-index={i}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(cmd)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm',
                      i === active && 'bg-accent text-accent-foreground',
                    )}
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="flex-1">{cmd.label}</span>
                    {i === active && <CornerDownLeft className="size-3.5 text-muted-foreground" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  )
}
