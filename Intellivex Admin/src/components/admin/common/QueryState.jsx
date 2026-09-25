import ErrorState from './ErrorState'
import EmptyState from './EmptyState'

/**
 * Renders the right state for a `useApiQuery` result:
 * loading → `skeleton`, error → ErrorState with retry, empty → EmptyState, else children.
 */
export default function QueryState({ query, skeleton, isEmpty, empty, children }) {
  const { data, error, isLoading, refetch } = query
  if (isLoading && !data) return skeleton
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (isEmpty?.(data)) return empty ?? <EmptyState />
  return children
}
