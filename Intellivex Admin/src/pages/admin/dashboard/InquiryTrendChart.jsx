import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import ChartCard from '@/components/admin/cards/ChartCard'
import QueryState from '@/components/admin/common/QueryState'
import EmptyState from '@/components/admin/common/EmptyState'
import { formatDate, formatShortDate } from '@/lib/format'

// Colors validated for CVD + contrast on both card surfaces (see styles/index.css).
const chartConfig = {
  inquiries: { label: 'Inquiries', color: 'var(--chart-1)' },
  converted: { label: 'Converted', color: 'var(--chart-2)' },
}

const RANGE_LABEL = { '7d': 'last 7 days', '30d': 'last 30 days', '90d': 'last 90 days' }

export default function InquiryTrendChart({ query, range, className }) {
  const points = query.data?.data ?? []
  const total = points.reduce((sum, p) => sum + p.inquiries, 0)

  return (
    <ChartCard
      className={className}
      title="Inquiries over time"
      description={query.data ? `${total} contact-form inquiries in the ${RANGE_LABEL[range]}` : 'Contact-form submissions'}
    >
      <QueryState
        query={query}
        skeleton={<Skeleton className="h-[280px] w-full" />}
        isEmpty={(d) => !d?.data?.length}
        empty={<EmptyState icon={TrendingUp} title="No inquiries in this period" />}
      >
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <ComposedChart data={points} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="fillInquiries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-inquiries)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-inquiries)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={28}
              tickFormatter={formatShortDate}
            />
            <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
            <ChartTooltip
              cursor={{ strokeDasharray: '4 4' }}
              content={<ChartTooltipContent indicator="line" labelFormatter={(value) => formatDate(value)} />}
            />
            <Area
              dataKey="inquiries"
              type="monotone"
              stroke="var(--color-inquiries)"
              strokeWidth={2}
              fill="url(#fillInquiries)"
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--card)' }}
            />
            <Line
              dataKey="converted"
              type="monotone"
              stroke="var(--color-converted)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--card)' }}
            />
            <ChartLegend content={<ChartLegendContent />} itemSorter={(item) => Object.keys(chartConfig).indexOf(item.dataKey)} />
          </ComposedChart>
        </ChartContainer>
      </QueryState>
    </ChartCard>
  )
}
