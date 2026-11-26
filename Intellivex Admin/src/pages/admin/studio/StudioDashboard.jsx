import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ChevronRight, ExternalLink, FileText, Inbox, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import PageHeader from '@/components/admin/layout/PageHeader'
import StatCard from '@/components/admin/cards/StatCard'
import ChartCard from '@/components/admin/cards/ChartCard'
import DataTable from '@/components/admin/tables/DataTable'
import EmptyState from '@/components/admin/common/EmptyState'
import { STUDIO_NAV_GROUPS, STUDIO_NAV_ITEMS } from '@/components/admin/sidebar/nav-config'
import { useApiQuery } from '@/hooks/useApiQuery'
import { STUDIO_SITE_URL } from '@/services/admin/config'
import { studioDashboardApi } from '@/services/admin/studio'
import { formatDate, formatNumber, initials } from '@/lib/format'

const nav = (key) => STUDIO_NAV_ITEMS.find((item) => item.key === key)

/** Content sections: one card each; `key` matches `sections` in the dashboard response. */
const SECTIONS = [
  { key: 'games', item: nav('studio-games'), unit: 'games' },
  { key: 'news', item: nav('studio-news'), unit: 'articles' },
  { key: 'jobs', item: nav('studio-careers'), unit: 'roles' },
  { key: 'members', item: nav('studio-team'), unit: 'members' },
  { key: 'reviews', item: nav('studio-testimonials'), unit: 'reviews' },
  { key: 'partners', item: nav('studio-partners'), unit: 'partners' },
]

function SectionCard({ item, unit, data, isLoading }) {
  const Icon = item.icon
  return (
    <Link to={item.path} aria-label={`${item.label}: open section`} className="group block rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
      <Card className="h-full gap-0 p-5 transition-colors group-hover:border-primary/40 group-hover:bg-accent/30">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
            <Icon className="size-5" strokeWidth={1.8} />
          </span>
        </div>
        {isLoading ? (
          <>
            <Skeleton className="mt-1 h-8 w-16" />
            <Skeleton className="mt-3 h-4 w-32" />
          </>
        ) : (
          <>
            <p className="-mt-1 font-display text-[26px] leading-9 font-medium tracking-tight">
              {data ? formatNumber(data.total) : '—'}
              {data && <span className="ml-1.5 text-sm font-normal text-muted-foreground">{unit}</span>}
            </p>
            <div className="mt-2 flex items-start gap-2 text-xs leading-snug text-muted-foreground">
              <span>{data ? `${formatNumber(data.published)} published · ${formatNumber(data.draft)} draft` : 'Couldn’t load this section'}</span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </>
        )}
      </Card>
    </Link>
  )
}

const person = (row) => (
  <div className="flex items-center gap-3">
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-primary">{initials(row.full_name ?? row.name)}</span>
    <div className="min-w-0">
      <p className="truncate font-medium">{row.full_name ?? row.name}</p>
      <p className="truncate text-xs text-muted-foreground">{row.email}</p>
    </div>
  </div>
)
const receivedColumn = {
  key: 'created_at',
  header: 'Received',
  cell: (row) => <span className="text-muted-foreground">{formatDate(row.created_at)}</span>,
  className: 'hidden sm:table-cell whitespace-nowrap',
  headerClassName: 'hidden sm:table-cell',
}

function RecentTable({ title, description, to, query, rows, columns, icon, emptyTitle, className }) {
  return (
    <Card className={`gap-0 overflow-hidden pb-0 ${className ?? ''}`}>
      <CardHeader className="pb-5">
        <CardTitle className="font-display text-base font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild className="text-primary">
            <Link to={to}>View all <ArrowRight /></Link>
          </Button>
        </CardAction>
      </CardHeader>
      <DataTable
        columns={columns}
        data={rows ?? []}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        empty={<EmptyState icon={icon} title={emptyTitle} description="They appear here as soon as visitors send them." />}
      />
    </Card>
  )
}

const ACTIONS = ['studio-games', 'studio-news', 'studio-careers', 'studio-team'].map(nav)
const PAGES = STUDIO_NAV_GROUPS.find((g) => g.label === 'Studio Pages').items

function Shortcut({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-accent/50">
      <span className="grid size-9 place-items-center rounded-lg bg-accent text-primary">
        <Icon className="size-[18px]" strokeWidth={1.8} />
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

/** Game Studio overview at /admin/studio — the studio's counterpart of the main dashboard. */
export default function StudioDashboard() {
  const query = useApiQuery(() => studioDashboardApi.get())
  const data = query.data

  const stats = [
    { label: 'Inquiries', icon: Inbox, value: data?.leads.inquiries, caption: 'consultation requests', to: '/admin/studio/inquiries' },
    { label: 'Applications', icon: FileText, value: data?.leads.applications, caption: 'job applications', to: '/admin/studio/applications' },
    { label: 'Subscribers', icon: Mail, value: data?.leads.subscribers, caption: 'newsletter sign-ups', to: '/admin/studio/subscribers' },
    { label: 'Open Roles', icon: nav('studio-careers').icon, value: data?.sections.jobs.published, caption: 'live on the Careers page', to: '/admin/studio/careers' },
  ]

  return (
    <>
      <PageHeader
        title="Game Studio Dashboard"
        description="Overview of the IntelliVex Game Studio website — content, leads and applications."
        actions={
          <Button asChild variant="outline">
            <a href={STUDIO_SITE_URL} target="_blank" rel="noreferrer">
              View website <ExternalLink />
            </a>
          </Button>
        }
      />

      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} caption={query.error ? 'Not available' : stat.caption} isLoading={query.isLoading} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SECTIONS.map(({ key, item, unit }) => (
            <SectionCard key={key} item={item} unit={unit} data={data?.sections[key]} isLoading={query.isLoading} />
          ))}
        </div>

        <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 xl:grid-cols-3">
          <div className="grid gap-4 sm:gap-6 xl:col-span-2">
            <RecentTable
              title="Recent inquiries"
              description="Latest consultation requests from the Game Studio contact form"
              to="/admin/studio/inquiries"
              query={query}
              rows={data?.recent_inquiries}
              icon={Inbox}
              emptyTitle="No inquiries yet"
              columns={[
                { key: 'full_name', header: 'Contact', cell: person },
                { key: 'subject', header: 'Subject', cell: (row) => <span className="line-clamp-1">{row.subject || row.message}</span>, className: 'hidden md:table-cell max-w-xs', headerClassName: 'hidden md:table-cell' },
                receivedColumn,
              ]}
            />
            <RecentTable
              title="Recent applications"
              description="Latest job applications from the Careers page"
              to="/admin/studio/applications"
              query={query}
              rows={data?.recent_applications}
              icon={FileText}
              emptyTitle="No applications yet"
              columns={[
                { key: 'name', header: 'Applicant', cell: person },
                { key: 'job_title', header: 'Role', className: 'hidden md:table-cell', headerClassName: 'hidden md:table-cell' },
                receivedColumn,
              ]}
            />
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-1">
            <ChartCard title="Quick actions" contentClassName="grid grid-cols-1 gap-2">
              {ACTIONS.map((item) => (
                <Shortcut key={item.key} to={`${item.path}/create`} icon={item.icon} label={`New ${item.singular.toLowerCase()}`} />
              ))}
            </ChartCard>
            <ChartCard title="Page content" description="Text and images on the studio’s pages" contentClassName="grid grid-cols-1 gap-2">
              {PAGES.map((item) => (
                <Shortcut key={item.key} to={item.path} icon={item.icon} label={item.label} />
              ))}
            </ChartCard>
          </div>
        </div>
      </div>
    </>
  )
}
