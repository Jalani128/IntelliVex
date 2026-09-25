import { Link } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import SidebarNav from './SidebarNav'

function Brand({ collapsed }) {
  return (
    <Link
      to="/admin"
      className={cn('flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border', collapsed ? 'justify-center px-0' : 'px-6')}
    >
      {collapsed ? (
        <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-deep font-display text-[15px] font-semibold text-white">
          IV
        </span>
      ) : (
        <>
          <img src="/logo.svg" alt="IntelliVex Technologies" className="h-8 w-auto" />
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white/80">Admin</span>
        </>
      )}
    </Link>
  )
}

/**
 * Sidebar body — shared by the fixed desktop sidebar and the mobile drawer.
 * `onToggleCollapse` is only passed on desktop.
 */
export function SidebarContent({ collapsed = false, onNavigate, onToggleCollapse }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Brand collapsed={collapsed} />

      <div className={cn('scrollbar-thin flex-1 overflow-y-auto py-5', collapsed ? 'px-3' : 'px-4')}>
        <SidebarNav collapsed={collapsed} onNavigate={onNavigate} />
      </div>

      {onToggleCollapse && (
        <div className={cn('border-t border-sidebar-border p-3', collapsed && 'flex justify-center')}>
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] text-white/60 transition-colors hover:bg-sidebar-accent hover:text-white',
              collapsed ? 'w-9 justify-center px-0' : 'w-full',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
            {!collapsed && 'Collapse'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ collapsed, onToggleCollapse }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-200 ease-out lg:block',
        collapsed ? 'w-[72px]' : 'w-[264px]',
      )}
    >
      <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </aside>
  )
}
