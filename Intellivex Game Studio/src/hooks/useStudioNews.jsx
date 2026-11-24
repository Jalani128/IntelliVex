import { createContext, useContext, useEffect, useState } from 'react'
import { NEWS } from '../data/news'

const NewsContext = createContext({ articles: NEWS, loading: true, fallback: true })
const API = (import.meta.env.VITE_STUDIO_API_URL || 'https://api.theintellivex.com/intellivex/public/api').replace(/\/$/, '')
const MEDIA = (import.meta.env.VITE_STUDIO_MEDIA_URL || 'https://api.theintellivex.com/intellivex/public/storage').replace(/\/$/, '')

function mapArticle(article) {
  const fallback = NEWS.find((item) => item.slug === article.slug)
  const url = article.image_url
  const at = url?.indexOf('/storage/')
  const date = article.published_at ? new Date(`${article.published_at.slice(0, 10)}T00:00:00`) : null
  return {
    slug: article.slug, title: article.title, excerpt: article.excerpt || '',
    date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
    body: article.body || [], imagePosition: article.image_position || 'center',
    image: url ? (at >= 0 ? `${MEDIA}/${url.slice(at + 9)}` : url) : fallback?.image || NEWS[0].image,
  }
}

export function StudioNewsProvider({ children }) {
  const [state, setState] = useState({ articles: NEWS, loading: true, fallback: true })
  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let active = true
    fetch(`${API}/studio/news`, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw new Error('News API unavailable'); return response.json() })
      .then((response) => { if (!Array.isArray(response.data)) throw new Error('Invalid news data'); if (active) setState({ articles: response.data.map(mapArticle), loading: false, fallback: false }) })
      .catch(() => { if (active) setState({ articles: NEWS, loading: false, fallback: true }) })
      .finally(() => clearTimeout(timeout))
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [])
  return <NewsContext.Provider value={state}>{children}</NewsContext.Provider>
}

export function useStudioNews() { return useContext(NewsContext) }
