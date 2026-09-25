import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PageHeader from '@/components/admin/layout/PageHeader'
import { useApiQuery } from '@/hooks/useApiQuery'
import { dashboardApi } from '@/services/admin/dashboard'
import StatsGrid from './dashboard/StatsGrid'
import InquiryTrendChart from './dashboard/InquiryTrendChart'
import ProjectsByIndustryChart from './dashboard/ProjectsByIndustryChart'
import RecentInquiries from './dashboard/RecentInquiries'
import RecentActivity from './dashboard/RecentActivity'
import QuickActions from './dashboard/QuickActions'

const RANGES = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

export default function Dashboard() {
  const [range, setRange] = useState('30d')

  // Each panel loads independently so one slow/failed endpoint doesn't block the page.
  const stats = useApiQuery(() => dashboardApi.getStats(range), [range])
  const trend = useApiQuery(() => dashboardApi.getInquiryTrend(range), [range])
  const industries = useApiQuery(() => dashboardApi.getProjectsByIndustry())
  const inquiries = useApiQuery(() => dashboardApi.getRecentInquiries(8))
  const activity = useApiQuery(() => dashboardApi.getActivity(6))

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of the IntelliVex website — content, leads and team activity."
        actions={
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[170px] bg-card" aria-label="Date range">
              <CalendarDays className="text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="space-y-4 sm:space-y-6">
        <StatsGrid query={stats} />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
          <InquiryTrendChart query={trend} range={range} className="xl:col-span-2" />
          <ProjectsByIndustryChart query={industries} />
        </div>

        <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 xl:grid-cols-3">
          <RecentInquiries query={inquiries} className="xl:col-span-2" />
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-1">
            <QuickActions />
            <RecentActivity query={activity} />
          </div>
        </div>
      </div>
    </>
  )
}
