import { Link, NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { NAV_GROUPS, SITES, STUDIO_NAV_GROUPS } from './nav-config'

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

/** Main website / Game Studio switch at the top of the sidebar; each opens that site's dashboard. */
function SiteSwitch({ current, collapsed, onNavigate }) {
  return (
    <div
      role="group"
      aria-label="Website"
      className={cn('grid gap-1 rounded-xl bg-white/5 p-1 ring-1 ring-sidebar-border', !collapsed && 'grid-cols-2')}
    >
      {SITES.map((site) => {
        const Icon = site.icon
        const active = site.key === current
        const link = (
          <Link
            to={site.path}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex h-9 min-w-0 items-center justify-center rounded-lg px-2 text-[13px] font-medium whitespace-nowrap transition-colors',
              'focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none',
              active ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : 'text-white/60 hover:bg-sidebar-accent hover:text-white',
            )}
          >
            {/* The sidebar is too narrow for two icons and labels, so icons only show when collapsed. */}
            {collapsed ? (
              <>
                <Icon className="size-4 shrink-0" strokeWidth={1.8} />
                <span className="sr-only">{site.label}</span>
              </>
            ) : (
              site.label
            )}
          </Link>
        )
        if (!collapsed) return <div key={site.key} className="grid min-w-0">{link}</div>
        return (
          <Tooltip key={site.key}>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">{site.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default function SidebarNav({ collapsed = false, onNavigate }) {
  const inStudio = useLocation().pathname.startsWith('/admin/studio')
  const groups = inStudio ? STUDIO_NAV_GROUPS : NAV_GROUPS
  return (
    <nav aria-label="Admin navigation" className="flex flex-col gap-5">
      <SiteSwitch current={inStudio ? 'studio' : 'main'} collapsed={collapsed} onNavigate={onNavigate} />
      {groups.map((group) => (
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
