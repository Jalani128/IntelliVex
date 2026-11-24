import { useEffect, useState } from 'react'

const API = (import.meta.env.VITE_STUDIO_API_URL || 'https://api.theintellivex.com/intellivex/public/api').replace(/\/$/, '')
const MEDIA = (import.meta.env.VITE_STUDIO_MEDIA_URL || 'https://api.theintellivex.com/intellivex/public/storage').replace(/\/$/, '')

export function useStudioHome() {
  const [page, setPage] = useState({ content: {}, images: {} })
  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let active = true
    fetch(`${API}/studio/home`, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw new Error('Home API unavailable'); return response.json() })
      .then((response) => { if (active && response.data) setPage(response.data) })
      .catch(() => {})
      .finally(() => clearTimeout(timeout))
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [])
  const text = (key, fallback) => page.content?.[key] ?? fallback
  const image = (key, fallback) => {
    const url = page.images?.[key]
    if (!url) return fallback
    const at = url.indexOf('/storage/')
    return at >= 0 ? `${MEDIA}/${url.slice(at + 9)}` : url
  }
  return { text, image }
}
