import { BriefcaseBusiness, Inbox, Layers, MessageSquareQuote } from 'lucide-react'
import { Card } from '@/components/ui/card'
import StatCard from '@/components/admin/cards/StatCard'
import ErrorState from '@/components/admin/common/ErrorState'

const STATS = [
  { key: 'inquiries', label: 'Total Inquiries', icon: Inbox },
  { key: 'projects', label: 'Portfolio Projects', icon: BriefcaseBusiness },
  { key: 'services', label: 'Published Services', icon: Layers },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
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
      {STATS.map(({ key, label, icon }) => (
        <StatCard
          key={key}
          label={label}
          icon={icon}
          value={stats?.[key].value}
          change={stats?.[key].change}
          isLoading={query.isLoading || !stats}
        />
      ))}
    </div>
  )
}
