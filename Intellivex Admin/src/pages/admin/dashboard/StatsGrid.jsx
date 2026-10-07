import { BriefcaseBusiness, Inbox, Layers, MessageSquareQuote } from 'lucide-react'
import { Card } from '@/components/ui/card'
import StatCard from '@/components/admin/cards/StatCard'
import ErrorState from '@/components/admin/common/ErrorState'

// Inquiries count the selected period; content counts are published totals and how they grew in it.
const STATS = [
// Each tile opens its list; content lists open filtered to the published rows the tile counts.
  { key: 'inquiries', label: 'Inquiries', icon: Inbox, caption: 'vs previous period', to: '/admin/inquiries' },
  { key: 'projects', label: 'Portfolio Projects', icon: BriefcaseBusiness, caption: 'growth this period', to: '/admin/projects?status=published' },
  { key: 'services', label: 'Published Services', icon: Layers, caption: 'growth this period', to: '/admin/services?status=published' },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, caption: 'growth this period', to: '/admin/testimonials?status=published' },
]

export default function StatsGrid({ query }) {
  if (query.error) {
    return (
      <Card className="py-0">
        <ErrorState title="Couldn’t load statistics" error={query.error} onRetry={query.refetch} />
      </Card>
    )
  }

  const stats = query.data?.data
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map(({ key, label, icon, caption, to }) => (
        <StatCard
          key={key}
          label={label}
          icon={icon}
          value={stats?.[key]?.value}
          change={stats?.[key]?.change}
          caption={stats?.[key] ? caption : 'Not available'}
          to={to}
          isLoading={query.isLoading || !stats}
        />
      ))}
    </div>
  )
}
