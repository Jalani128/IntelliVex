import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import ChartCard from '@/components/admin/cards/ChartCard'
import { NAV_ITEMS } from '@/components/admin/sidebar/nav-config'

const ACTION_KEYS = ['services', 'projects', 'testimonials', 'team']
const ACTIONS = NAV_ITEMS.filter((item) => ACTION_KEYS.includes(item.key))

export default function QuickActions({ className }) {
  return (
    <ChartCard className={className} title="Quick actions" contentClassName="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
      {ACTIONS.map(({ key, singular, path, icon: Icon }) => (
        <Link
          key={key}
          to={`${path}/create`}
          className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-accent/50"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-accent text-primary">
            <Icon className="size-[18px]" strokeWidth={1.8} />
          </span>
          <span className="flex-1 text-sm font-medium">New {singular.toLowerCase()}</span>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </ChartCard>
  )
}
