import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Plus, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import DataTable from '@/components/admin/tables/DataTable'
import TableToolbar from '@/components/admin/filters/TableToolbar'
import StatusBadge from '@/components/admin/common/StatusBadge'
import RowActions from '@/components/admin/common/RowActions'
import EmptyState from '@/components/admin/common/EmptyState'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import FormSheet from '@/components/admin/modals/FormSheet'
import FormActions from '@/components/admin/forms/FormActions'
import { SortOrderField, SwitchField, TextField } from '@/components/admin/forms/FormFields'
import { useApiQuery } from '@/hooks/useApiQuery'
import { categoriesApi, productsApi, categoryLabel, categoryActive, LIMITS } from '@/services/admin/products'
import { SLUG_PATTERN, slugify } from '@/lib/format'

/** Validation mirrors the Laravel rules in products-backend-spec.md §3.2. */
const buildSchema = () =>
  z.object({
    title: z.string().trim().min(1, 'Title is required').max(100, 'Max 100 characters'),
    // Optional: the API generates the slug from the title when it's empty.
    slug: z
      .string()
      .trim()
      .max(120, 'Max 120 characters')
      .refine((v) => !v || SLUG_PATTERN.test(v), 'Use lowercase letters, numbers and dashes only'),
    is_active: z.boolean(),
    sort_order: z.coerce.number({ invalid_type_error: 'Enter a number' }).int('Whole numbers only').min(0, 'Must be 0 or more'),
  })

function CategoryForm({ category, onSaved, onCancel }) {
  const isEdit = !!category
  const form = useForm({
    resolver: zodResolver(buildSchema()),
    defaultValues: {
      title: categoryLabel(category),
      slug: category?.slug ?? '',
      is_active: category ? categoryActive(category) : true,
      sort_order: category?.sort_order ?? 0,
    },
  })
  const { control, setValue } = form

  // Slug follows the title for new categories; existing slugs stay put.
  const title = useWatch({ control, name: 'title' })
  useEffect(() => {
    if (!isEdit) setValue('slug', slugify(title))
  }, [title, isEdit, setValue])

  const onSubmit = async (formValues) => {
    const values = { ...formValues, slug: formValues.slug || null }
    try {
      if (isEdit) await categoriesApi.update(category.id, values)
      else await categoriesApi.create(values)
      toast.success(isEdit ? 'Category updated' : 'Category added')
      onSaved()
    } catch (err) {
      Object.entries(err.errors ?? {}).forEach(([field, messages]) => form.setError(field, { message: messages[0] }))
      toast.error(err.message || 'Could not save the category')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <TextField control={control} name="title" label="Title *" max={100} placeholder="e.g. AI & Data" description="Pill text on the Products and Portfolio pages." />
        <TextField control={control} name="slug" label="Slug" max={120} description="Filter value. Leave empty to let the server generate it." />
        <div className="grid gap-5 sm:grid-cols-2">
          <SwitchField control={control} name="is_active" label="Active" description={`Shown on the website (up to ${LIMITS.activeCategories}).`} />
          <SortOrderField control={control} description={null} className="w-full" />
        </div>
        <FormActions isSubmitting={form.formState.isSubmitting} submitLabel={isEdit ? 'Save changes' : 'Add category'} onCancel={onCancel} className="pt-2" />
      </form>
    </Form>
  )
}

export default function CategoriesTab() {
  const [editing, setEditing] = useState(undefined)
  const [toDelete, setToDelete] = useState(null)
  const query = useApiQuery(() => categoriesApi.list({ per_page: 100, sort: 'sort_order' }), [])
  const products = useApiQuery(() => productsApi.list({ per_page: 500 }), [])
  const rows = query.data?.data ?? []
  const live = rows.filter(categoryActive)
  const productCount = (id) => (products.data?.data ?? []).filter((p) => (p.category?.id ?? p.solution_category_id) === id).length

  // No status route — `is_active` is a partial update. The API allows 5 active categories.
  const toggleStatus = async (row) => {
    const next = !categoryActive(row)
    try {
      await categoriesApi.update(row.id, { is_active: next })
      toast.success(`${categoryLabel(row)} ${next ? 'shown' : 'hidden'}`)
      query.refetch()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await categoriesApi.remove(toDelete.id)
      toast.success('Category deleted')
      query.refetch()
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Category',
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{categoryLabel(row)}</p>
          <p className="truncate text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'products',
      header: 'Products',
      cell: (row) => <span className="tabular-nums">{productCount(row.id)}</span>,
      className: 'hidden sm:table-cell',
      headerClassName: 'hidden sm:table-cell',
    },
    { key: 'is_active', header: 'Status', cell: (row) => <StatusBadge status={categoryActive(row) ? 'active' : 'inactive'} /> },
    { key: 'sort_order', header: 'Order', className: 'hidden sm:table-cell tabular-nums', headerClassName: 'hidden sm:table-cell' },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (row) => (
        <RowActions
          label={`Actions for ${categoryLabel(row)}`}
          onEdit={() => setEditing(row)}
          onDelete={() => setToDelete(row)}
          extra={[
            {
              label: categoryActive(row) ? 'Hide pill' : 'Show pill',
              icon: categoryActive(row) ? EyeOff : Eye,
              onSelect: () => toggleStatus(row),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar
        actions={
          <Button onClick={() => setEditing(null)}>
            <Plus /> Add Category
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          Category pills on the Products and Portfolio pages, in this order.{' '}
          <span className={live.length >= LIMITS.activeCategories ? 'font-medium text-warning' : ''}>
            {live.length} / {LIMITS.activeCategories} active
          </span>
        </p>
      </TableToolbar>

      {live.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b bg-muted/30 px-6 py-3">
          <span className="mr-1 text-xs text-muted-foreground">Website preview:</span>
          {live.map((c) => (
            <span key={c.id} className="rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-medium text-primary">
              {categoryLabel(c)}
            </span>
          ))}
        </div>
      )}

      <DataTable
        columns={columns}
        data={rows}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={query.refetch}
        onRowClick={(row) => setEditing(row)}
        empty={<EmptyState icon={Tags} title="No categories yet" description="Add the solution categories shown as pills." />}
      />

      <FormSheet
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
        title={editing ? `Edit ${categoryLabel(editing)}` : 'Add Category'}
        description="Pill on the Products and Portfolio pages."
      >
        {editing !== undefined && (
          <CategoryForm
            key={editing?.id ?? 'new'}
            category={editing}
            onCancel={() => setEditing(undefined)}
            onSaved={() => {
              setEditing(undefined)
              query.refetch()
            }}
          />
        )}
      </FormSheet>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this category?"
        description={
          toDelete
            ? `“${categoryLabel(toDelete)}” will be removed. Categories still used by a product or portfolio project can’t be deleted — hide them instead.`
            : undefined
        }
      />
    </Card>
  )
}
