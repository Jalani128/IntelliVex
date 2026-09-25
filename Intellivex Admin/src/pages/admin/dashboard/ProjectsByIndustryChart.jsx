import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import { Building2 } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import ChartCard from '@/components/admin/cards/ChartCard'
import QueryState from '@/components/admin/common/QueryState'
import EmptyState from '@/components/admin/common/EmptyState'

const chartConfig = { projects: { label: 'Projects', color: 'var(--chart-1)' } }

/** Single-series magnitude → one hue, sorted bars, direct value labels. */
export default function ProjectsByIndustryChart({ query, className }) {
  const rows = [...(query.data?.data ?? [])].sort((a, b) => b.projects - a.projects)

  return (
    <ChartCard className={className} title="Projects by industry" description="Portfolio projects per industry">
      <QueryState
        query={query}
        skeleton={
          <div className="space-y-4 pt-1">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-6" style={{ width: `${90 - i * 12}%` }} />
            ))}
          </div>
        }
        isEmpty={(d) => !d?.data?.length}
        empty={<EmptyState icon={Building2} title="No projects yet" />}
      >
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 28, left: 0, bottom: 0 }} barCategoryGap={10}>
            <XAxis type="number" dataKey="projects" hide />
            <YAxis type="category" dataKey="industry" tickLine={false} axisLine={false} width={88} tickMargin={4} />
            <ChartTooltip cursor={{ fill: 'var(--muted)', opacity: 0.6 }} content={<ChartTooltipContent hideLabel={false} />} />
            <Bar dataKey="projects" fill="var(--color-projects)" radius={[0, 4, 4, 0]} maxBarSize={22}>
              <LabelList dataKey="projects" position="right" offset={8} className="fill-muted-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </QueryState>
    </ChartCard>
  )
}
