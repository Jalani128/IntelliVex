import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BriefcaseBusiness, EyeOff, House, Plus, Send, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { projectsApi, projectSiteUrl, categoryLabel, LIMITS, PUBLISH_STATUSES } from '@/services/admin/projects'
import { categoriesApi } from '@/services/admin/products'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'

const PLACEMENTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'home', label: 'On Home page' },
]

export default function ProjectsTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  // `?status=published` (from the dashboard) preselects the filter.
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState(() => searchParams.get('status') ?? 'all')
  const [category, setCategory] = useState('all')
  const [placement, setPlacement] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [toDelete, setToDelete] = useState(null)
  const debouncedSearch = useDebounce(search)

  const query = useApiQuery(
    () =>
      projectsApi.list({
        search: debouncedSearch,
        status,
        category,
        is_featured: placement === 'featured' ? 1 : undefined,
        show_on_home: placement === 'home' ? 1 : undefined,
        page,
        per_page: perPage,
        sort: 'sort_order',
      }),
    [debouncedSearch, status, category, placement, page, perPage],
  )
  const onHome = useApiQuery(() => projectsApi.list({ status: 'published', show_on_home: 1, per_page: 50 }), [])
  const categories = useApiQuery(() => categoriesApi.list({ per_page: 200, sort: 'sort_order' }), [])
  const homeCount = onHome.data?.meta.total ?? 0

  // The API filters `category` by slug.
  const categoryList = categories.data?.data ?? []
  const categoryOptions = useMemo(
    () => (categories.data?.data ?? []).map((c) => ({ value: c.slug, label: categoryLabel(c) })),
    [categories.data],
  )
  const categoryName = (id) => categoryLabel(categoryList.find((c) => c.id === id)) || undefined

  const withReset = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const refresh = () => {
    query.refetch()
    onHome.refetch()
  }

  // Status goes through PATCH /projects/{id}/status; flags are partial updates.
  const update = async (row, patch, message) => {
    try {
      if ('status' in patch) await projectsApi.setStatus(row.id, patch.status)
      else await projectsApi.update(row.id, patch)
      toast.success(message)
      refresh()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await projectsApi.remove(toDelete.id)
      toast.success('Project deleted')
      refresh()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Project',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-16 shrink-0 place-items-center overflow-hidden rounded-md border bg-muted text-muted-foreground">
            {row.card_image_url ? <img src={row.card_image_url} alt="" className="size-full object-cover" /> : <BriefcaseBusiness className="size-4" />}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{row.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.badge && <span className="font-medium text-primary">{row.badge} · </span>}
              /portfolio/{row.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: (row) => <span className="text-muted-foreground">{row.category?.title ?? categoryName(row.solution_category_id) ?? '—'}</span>,
      className: 'hidden lg:table-cell',
      headerClassName: 'hidden lg:table-cell',
    },
    {
      key: 'flags',
      header: 'Shown in',
      cell: (row) =>
        row.is_featured || row.show_on_home ? (
          <div className="flex flex-wrap gap-1.5">
            {row.is_featured && <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary">Featured</span>}
            {row.show_on_home && <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary">Home</span>}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Portfolio only</span>
        ),
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { key: 'sort_order', header: 'Order', className: 'hidden sm:table-cell tabular-nums', headerClassName: 'hidden sm:table-cell' },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (row) => (
        <RowActions
          label={`Actions for ${row.title}`}
          onView={row.status === 'published' && projectSiteUrl(row) ? () => window.open(projectSiteUrl(row), '_blank', 'noopener') : undefined}
          onEdit={() => navigate(`/admin/projects/${row.id}/edit`)}
          onDelete={() => setToDelete(row)}
          extra={[
            {
              label: row.status === 'published' ? 'Move to draft' : 'Publish',
              icon: row.status === 'published' ? EyeOff : Send,
              onSelect: () => update(row, { status: row.status === 'published' ? 'draft' : 'published' }, `${row.title} updated`),
            },
            {
              label: row.is_featured ? 'Unfeature' : 'Feature',
              icon: Star,
              onSelect: () => update(row, { is_featured: !row.is_featured }, `${row.title} ${row.is_featured ? 'unfeatured' : 'featured'}`),
            },
            {
              label: row.show_on_home ? 'Remove from Home' : 'Show on Home',
              icon: House,
              onSelect: () => update(row, { show_on_home: !row.show_on_home }, `${row.title} ${row.show_on_home ? 'removed from' : 'added to'} Home page`),
            },
          ]}
        />
      ),
    },
  ]

  const hasFilters = debouncedSearch || status !== 'all' || category !== 'all' || placement !== 'all'

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar
        actions={
          <Button asChild>
            <Link to="/admin/projects/create">
              <Plus /> Add Project
            </Link>
          </Button>
        }
      >
        <SearchInput value={search} onChange={withReset(setSearch)} placeholder="Search title, badge…" />
        <FilterSelect value={status} onChange={withReset(setStatus)} options={PUBLISH_STATUSES} allLabel="All statuses" label="Status" />
        <FilterSelect value={category} onChange={withReset(setCategory)} options={categoryOptions} allLabel="All categories" label="Category" />
        <FilterSelect value={placement} onChange={withReset(setPlacement)} options={PLACEMENTS} allLabel="All projects" label="Shown in" />
      </TableToolbar>

      {onHome.data && (
        <div className="border-b bg-muted/30 px-6 py-2.5">
          <span className={cn('text-xs', homeCount > LIMITS.home ? 'font-medium text-warning' : 'text-muted-foreground')}>
            Home page “Projects”: <span className="tabular-nums">{homeCount} / {LIMITS.home}</span>
            {homeCount > LIMITS.home && ` — only the first ${LIMITS.home} show`}
          </span>
          <span className="ml-6 text-xs text-muted-foreground">Order here = Portfolio order and Previous / Next on detail pages.</span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        onRowClick={(row) => navigate(`/admin/projects/${row.id}/edit`)}
        empty={
          <EmptyState
            icon={BriefcaseBusiness}
            title={hasFilters ? 'No matching projects' : 'No projects yet'}
            description={hasFilters ? 'Try a different search or filter.' : 'Add your first case study to the portfolio.'}
          />
        }
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} onPerPageChange={withReset(setPerPage)} />

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this project?"
        description={toDelete ? `“${toDelete.title}”, its gallery and challenges will be removed from the website.` : undefined}
      />
    </Card>
  )
}
