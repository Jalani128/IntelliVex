import { Card } from '@/components/ui/card'
import { FormSkeleton } from '@/components/admin/forms/FormFields'
import ErrorState from '@/components/admin/common/ErrorState'
import { useApiQuery } from '@/hooks/useApiQuery'

/**
 * Loads a single-row page-content record and renders `Form` once it arrives.
 * Refetching after a save bumps `updated_at`, which remounts the form with the saved values.
 */
export default function PageContentLoader({ api, Form }) {
  const query = useApiQuery(() => api.get(), [api])
  const page = query.data?.data

  if (query.error) {
    return (
      <Card>
        <ErrorState error={query.error} onRetry={query.refetch} />
      </Card>
    )
  }
  if (!page) return <FormSkeleton />
  return <Form key={page.updated_at} page={page} onSaved={query.refetch} />
}
