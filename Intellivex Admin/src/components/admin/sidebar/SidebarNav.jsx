import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { NAV_GROUPS } from './nav-config'

function NavItem({ item, collapsed, onNavigate }) {
  const Icon = item.icon

  const link = (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex h-10 items-center gap-3 rounded-lg px-3 text-[14px] font-medium transition-colors',
          'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          'focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none',
          isActive &&
            'bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_6px_18px_-6px_rgba(48,118,255,0.7)] hover:bg-sidebar-primary hover:text-sidebar-primary-foreground',
          collapsed && 'justify-center px-0',
        )
      }
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}

export default function SidebarNav({ collapsed = false, onNavigate }) {
  return (
    <nav aria-label="Admin navigation" className="flex flex-col gap-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          {collapsed ? (
            <div className="mx-auto mb-1 h-px w-6 bg-sidebar-border first:hidden" aria-hidden />
          ) : (
            <p className="px-3 pb-1 font-display text-[11px] font-medium tracking-[0.14em] text-white/40 uppercase">
              {group.label}
            </p>
          )}
          {group.items.map((item) => (
            <NavItem key={item.key} item={item} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
        </div>
      ))}
    </nav>
  )
}
