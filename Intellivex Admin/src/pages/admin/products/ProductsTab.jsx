import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { EyeOff, Package, Plus, Send, Sparkles, Star } from 'lucide-react'
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
import { categoriesApi, productsApi, productSiteUrl, categoryLabel, LIMITS, PUBLISH_STATUSES } from '@/services/admin/products'
import { DEFAULT_PER_PAGE } from '@/services/admin/config'

const PLACEMENTS = [
  { value: 'featured', label: 'Featured Products' },
  { value: 'showcase', label: 'Product Showcase' },
]

function SlotCount({ label, count, max }) {
  return (
    <span className={cn('text-xs', count > max ? 'font-medium text-warning' : 'text-muted-foreground')}>
      {label}: <span className="tabular-nums">{count} / {max}</span>
      {count > max && ` — only the first ${max} show`}
    </span>
  )
}

export default function ProductsTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [placement, setPlacement] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [toDelete, setToDelete] = useState(null)
  const debouncedSearch = useDebounce(search)

  const query = useApiQuery(
    () =>
      productsApi.list({
        search: debouncedSearch,
        status,
        category,
        is_featured: placement === 'featured' ? 1 : undefined,
        show_in_showcase: placement === 'showcase' ? 1 : undefined,
        page,
        per_page: perPage,
        sort: 'sort_order',
      }),
    [debouncedSearch, status, category, placement, page, perPage],
  )
  const published = useApiQuery(() => productsApi.list({ status: 'published', per_page: 200 }), [])
  const categories = useApiQuery(() => categoriesApi.list({ per_page: 200, sort: 'sort_order' }), [])
  const live = published.data?.data ?? []

  // The API filters `category` by slug.
  const categoryList = categories.data?.data ?? []
  const categoryOptions = useMemo(
    () => (categories.data?.data ?? []).map((c) => ({ value: c.slug, label: categoryLabel(c) })),
    [categories.data],
  )
  const categoryName = (row) => row.category?.title ?? (categoryLabel(categoryList.find((c) => c.id === row.solution_category_id)) || null)

  const withReset = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const refresh = () => {
    query.refetch()
    published.refetch()
  }

  const update = async (row, patch, message) => {
    try {
      await productsApi.update(row.id, patch)
      toast.success(message)
      refresh()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await productsApi.remove(toDelete.id)
      toast.success('Product deleted')
      refresh()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Product',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-16 shrink-0 place-items-center overflow-hidden rounded-md border bg-muted text-muted-foreground">
            {row.image_url ? <img src={row.image_url} alt="" className="size-full object-cover" /> : <Package className="size-4" />}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{row.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.badge && <span className="font-medium text-primary">{row.badge}</span>}
              {row.badge && categoryName(row) && ' · '}
              {categoryName(row)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'placement',
      header: 'Shown in',
      cell: (row) =>
        row.is_featured || row.show_in_showcase ? (
          <div className="flex flex-wrap gap-1.5">
            {row.is_featured && <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary">Featured</span>}
            {row.show_in_showcase && <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary">Showcase</span>}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Product list only</span>
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
          onView={row.status === 'published' && productSiteUrl(row) ? () => window.open(productSiteUrl(row), '_blank', 'noopener') : undefined}
          onEdit={() => navigate(`/admin/products/${row.id}/edit`)}
          onDelete={() => setToDelete(row)}
          extra={[
            {
              label: row.status === 'published' ? 'Move to draft' : 'Publish',
              icon: row.status === 'published' ? EyeOff : Send,
              onSelect: () => update(row, { status: row.status === 'published' ? 'draft' : 'published' }, `${row.title} updated`),
            },
            {
              label: row.is_featured ? 'Remove from Featured' : 'Add to Featured',
              icon: Star,
              onSelect: () => update(row, { is_featured: !row.is_featured }, `${row.title} ${row.is_featured ? 'removed from' : 'added to'} Featured Products`),
            },
            {
              label: row.show_in_showcase ? 'Remove from Showcase' : 'Add to Showcase',
              icon: Sparkles,
              onSelect: () =>
                update(row, { show_in_showcase: !row.show_in_showcase }, `${row.title} ${row.show_in_showcase ? 'removed from' : 'added to'} Product Showcase`),
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
            <Link to="/admin/products/create">
              <Plus /> Add Product
            </Link>
          </Button>
        }
      >
        <SearchInput value={search} onChange={withReset(setSearch)} placeholder="Search products…" />
        <FilterSelect value={status} onChange={withReset(setStatus)} options={PUBLISH_STATUSES} allLabel="All statuses" label="Status" />
        <FilterSelect value={category} onChange={withReset(setCategory)} options={categoryOptions} allLabel="All categories" label="Category" />
        <FilterSelect value={placement} onChange={withReset(setPlacement)} options={PLACEMENTS} allLabel="All sections" label="Shown in" />
      </TableToolbar>

      {published.data && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-b bg-muted/30 px-6 py-2.5">
          <SlotCount label="Featured Products" count={live.filter((p) => p.is_featured).length} max={LIMITS.featured} />
          <SlotCount label="Product Showcase" count={live.filter((p) => p.show_in_showcase).length} max={LIMITS.showcase} />
        </div>
      )}

      <DataTable
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        onRowClick={(row) => navigate(`/admin/products/${row.id}/edit`)}
        empty={
          <EmptyState
            icon={Package}
            title={hasFilters ? 'No matching products' : 'No products yet'}
            description={hasFilters ? 'Try a different search or filter.' : 'Add products to show them on the Products page.'}
          />
        }
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} onPerPageChange={withReset(setPerPage)} />

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this product?"
        description={toDelete ? `“${toDelete.title}” and its gallery will be removed from the website.` : undefined}
      />
    </Card>
  )
}
