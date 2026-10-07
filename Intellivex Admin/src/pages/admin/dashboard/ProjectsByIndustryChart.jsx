import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import ChartCard from '@/components/admin/cards/ChartCard'
import QueryState from '@/components/admin/common/QueryState'
import EmptyState from '@/components/admin/common/EmptyState'

const chartConfig = { projects: { label: 'Projects', color: 'var(--chart-1)' } }

/** Single-series magnitude → one hue, sorted bars, direct value labels. Clicking a row opens its industry. */
export default function ProjectsByIndustryChart({ query, className }) {
  const navigate = useNavigate()
  const rows = [...(query.data?.data ?? [])].sort((a, b) => b.projects - a.projects)

  return (
    <ChartCard
      className={className}
      title="Projects by industry"
      description="Portfolio projects per industry"
      action={
        <Button variant="ghost" size="sm" asChild className="text-primary">
          <Link to="/admin/industries" aria-label="View all industries">
            View all <ArrowRight />
          </Link>
        </Button>
      }
    >
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
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full cursor-pointer">
          <BarChart
            // Recharts 3 reports the clicked row as `activeIndex` (and its label as `activeLabel`).
            onClick={(state) => {
              const row = rows[Number(state?.activeIndex)] ?? rows.find((r) => r.industry === state?.activeLabel)
              if (row?.id) navigate(`/admin/industries/${row.id}/edit`)
            }}
            data={rows} layout="vertical" margin={{ top: 0, right: 28, left: 0, bottom: 0 }} barCategoryGap={10}>
            <XAxis type="number" dataKey="projects" hide />
            <YAxis type="category" dataKey="industry" tickLine={false} axisLine={false} width={88} tickMargin={4} />
            <ChartTooltip cursor={{ fill: 'var(--muted)', opacity: 0.6 }} content={<ChartTooltipContent hideLabel={false} />} />
            <Bar
              dataKey="projects"
              fill="var(--color-projects)"
              radius={[0, 4, 4, 0]}
              maxBarSize={22}
            >
              <LabelList dataKey="projects" position="right" offset={8} className="fill-muted-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </QueryState>
    </ChartCard>
  )
}
