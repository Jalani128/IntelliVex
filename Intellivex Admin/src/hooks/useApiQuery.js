import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Minimal data-fetching hook for the admin service layer.
 * `fetcher` returns a promise; the query re-runs whenever `deps` change.
 * Responses from superseded calls are dropped so fast filter changes can't
 * overwrite newer results.
 */
export function useApiQuery(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, error: null, isLoading: true })
  const callId = useRef(0)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refetch = useCallback(async () => {
    const id = ++callId.current
    setState((s) => ({ ...s, isLoading: true, error: null }))
    try {
      const data = await fetcherRef.current()
      if (id === callId.current) setState({ data, error: null, isLoading: false })
    } catch (error) {
      if (id === callId.current) setState((s) => ({ ...s, error, isLoading: false }))
    }
  }, [])

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ...state, refetch }
}
