import { useEffect, useState } from 'react'

export const STUDIO_API = (import.meta.env.VITE_STUDIO_API_URL || 'https://api.theintellivex.com/intellivex/public/api').replace(/\/$/, '')
const MEDIA = (import.meta.env.VITE_STUDIO_MEDIA_URL || 'https://api.theintellivex.com/intellivex/public/storage').replace(/\/$/, '')

/** API image URLs point at a private host; serve the path after /storage/ from MEDIA instead. */
export function media(url, fallback = null) {
  if (!url) return fallback
  const at = url.indexOf('/storage/')
  return at >= 0 ? `${MEDIA}/${url.slice(at + 9)}` : url
}

// One request per path for the whole visit, so pages opened later don't wait or flash again.
const requests = new Map()
const results = new Map()

function load(path) {
  if (!requests.has(path)) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const request = fetch(`${STUDIO_API}${path}`, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw new Error(`${path} ${response.status}`); return response.json() })
      .then((body) => ({ status: 'ok', data: body.data }))
      .catch(() => ({ status: 'error', data: null }))
      .finally(() => clearTimeout(timeout))
      .then((result) => { results.set(path, result); return result })
    requests.set(path, request)
  }
  return requests.get(path)
}

/**
 * `{ status: 'loading' | 'ok' | 'error', data }` for a public studio endpoint.
 * Callers show a loader while loading and their built-in content only on error,
 * so a refresh never flashes the built-in content before the real data.
 */
export function useStudioApi(path) {
  const [state, setState] = useState(() => results.get(path) ?? { status: 'loading', data: null })
  useEffect(() => {
    let active = true
    load(path).then((result) => active && setState(result))
    return () => { active = false }
  }, [path])
  return state
}
