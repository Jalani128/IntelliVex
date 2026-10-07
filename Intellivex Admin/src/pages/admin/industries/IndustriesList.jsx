import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Building2, Check, EyeOff, FileText, Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/admin/layout/PageHeader'
import DataTable from '@/components/admin/tables/DataTable'
import TablePagination from '@/components/admin/tables/TablePagination'
import TableToolbar from '@/components/admin/filters/TableToolbar'
import SearchInput from '@/components/admin/filters/SearchInput'
import FilterSelect from '@/components/admin/filters/FilterSelect'
import StatusBadge from '@/components/admin/common/StatusBadge'
import RowActions from '@/components/admin/common/RowActions'
import EmptyState from '@/components/admin/common/EmptyState'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useDebounce } from '@/hooks/useDebounce'
import { industriesApi, industryName, industrySiteUrl, INDUSTRY_STATUSES } from '@/services/admin/industries'
import PageContentTab from './PageContentTab'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'
import { formatDate } from '@/lib/format'

const MENU_OPTIONS = [
  { value: '1', label: 'In menu' },
  { value: '0', label: 'Not in menu' },
]

function Flag({ on, label }) {
  return on ? (
    <Check className="size-4 text-success" aria-label={label} />
  ) : (
    <span className="text-muted-foreground" aria-label={`Not ${label.toLowerCase()}`}>
      –
    </span>
  )
}

function IndustriesTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [menu, setMenu] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [toDelete, setToDelete] = useState(null)
  const debouncedSearch = useDebounce(search)

  const query = useApiQuery(
    () =>
      industriesApi.list({
        search: debouncedSearch,
        status,
        show_in_menu: menu,
        page,
        per_page: perPage,
        sort: 'sort_order',
      }),
    [debouncedSearch, status, menu, page, perPage],
  )

  const withReset = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const toggleStatus = async (row) => {
    const next = row.status === 'published' ? 'draft' : 'published'
    try {
      await industriesApi.setStatus(row.id, next)
      toast.success(`${industryName(row)} ${next === 'published' ? 'published' : 'moved to draft'}`)
      query.refetch()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await industriesApi.remove(toDelete.id)
      toast.success('Industry deleted')
      query.refetch()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Industry',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border bg-accent text-primary">
            {row.icon_url ? <img src={row.icon_url} alt="" className="size-full object-contain p-1.5" /> : <Building2 className="size-4" />}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{industryName(row)}</p>
            <p className="truncate text-xs text-muted-foreground">/industries/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'short_description',
      header: 'Card Text',
      cell: (row) => <p className="max-w-[260px] truncate text-muted-foreground">{row.short_description}</p>,
      className: 'hidden xl:table-cell',
      headerClassName: 'hidden xl:table-cell',
    },
    {
      key: 'is_featured',
      header: 'Featured',
      cell: (row) => <Flag on={row.is_featured} label="Featured" />,
      className: 'hidden lg:table-cell',
      headerClassName: 'hidden lg:table-cell',
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'show_in_menu',
      header: 'Menu',
      cell: (row) => <Flag on={row.show_in_menu} label="In menu" />,
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
    },
    {
      key: 'sort_order',
      header: 'Order',
      className: 'hidden sm:table-cell tabular-nums',
      headerClassName: 'hidden sm:table-cell',
    },
    {
      key: 'updated_at',
      header: 'Updated',
      cell: (row) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(row.updated_at)}</span>,
      className: 'hidden xl:table-cell',
      headerClassName: 'hidden xl:table-cell',
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (row) => (
        <RowActions
          label={`Actions for ${industryName(row)}`}
          onView={row.status === 'published' && industrySiteUrl(row) ? () => window.open(industrySiteUrl(row), '_blank', 'noopener') : undefined}
          onEdit={() => navigate(`/admin/industries/${row.id}/edit`)}
          onDelete={() => setToDelete(row)}
          extra={[
            {
              label: row.status === 'published' ? 'Move to draft' : 'Publish',
              icon: row.status === 'published' ? EyeOff : Send,
              onSelect: () => toggleStatus(row),
            },
          ]}
        />
      ),
    },
  ]

  const hasFilters = debouncedSearch || status !== 'all' || menu !== 'all'

  return (
    <>
      <Card className="gap-0 overflow-hidden py-0">
        <TableToolbar
          actions={
            <Button asChild>
              <Link to="/admin/industries/create">
                <Plus /> Add Industry
              </Link>
            </Button>
          }
        >
          <SearchInput value={search} onChange={withReset(setSearch)} placeholder="Search title or slug…" />
          <FilterSelect value={status} onChange={withReset(setStatus)} options={INDUSTRY_STATUSES} allLabel="All statuses" label="Status" />
          <FilterSelect value={menu} onChange={withReset(setMenu)} options={MENU_OPTIONS} allLabel="Menu: any" label="Header menu" />
        </TableToolbar>

        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          error={query.error}
          onRetry={query.refetch}
          onRowClick={(row) => navigate(`/admin/industries/${row.id}/edit`)}
          empty={
            <EmptyState
              icon={Building2}
              title={hasFilters ? 'No matching industries' : 'No industries yet'}
              description={hasFilters ? 'Try a different search or filter.' : 'Add your first industry to show it on the website.'}
              action={
                !hasFilters && (
                  <Button asChild size="sm">
                    <Link to="/admin/industries/create">
                      <Plus /> Add Industry
                    </Link>
                  </Button>
                )
              }
            />
          }
        />

        <TablePagination meta={query.data?.meta} onPageChange={setPage} onPerPageChange={withReset(setPerPage)} />
      </Card>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this industry?"
        description={
          toDelete
            ? `“${industryName(toDelete)}” will be removed from the website. Its links to services and projects are removed; the services and projects stay.`
            : undefined
        }
      />
    </>
  )
}

const TABS = [
  { value: 'industries', label: 'Industries', icon: Building2, Content: IndustriesTab },
  { value: 'content', label: 'Page Content', icon: FileText, Content: PageContentTab },
]

/**
 * /admin/industries — industry records and the Industries page's own content.
 * The active tab lives in `?tab=`.
 */
export default function IndustriesList() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'industries'

  return (
    <>
      <PageHeader
        title="Industries"
        description="Industries shown on the website — the Industries page, Industry Details pages and the header menu."
      />

      <Tabs value={tab} onValueChange={(value) => setParams(value === 'industries' ? {} : { tab: value }, { replace: true })} className="gap-4">
        <TabsList className="h-auto min-h-10 flex-wrap">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="px-3 py-1.5">
              <Icon /> {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(({ value, Content }) => (
          <TabsContent key={value} value={value}>
            <Content />
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
