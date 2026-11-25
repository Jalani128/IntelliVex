import { createContext, useContext } from 'react'
import { NEWS } from '../data/news'
import { media, useStudioApi } from '../lib/studioApi'

const NewsContext = createContext({ articles: [], loading: true, fallback: false })

function mapArticle(article) {
  const fallback = NEWS.find((item) => item.slug === article.slug)
  const date = article.published_at ? new Date(`${article.published_at.slice(0, 10)}T00:00:00`) : null
  return {
    slug: article.slug, title: article.title, excerpt: article.excerpt || '',
    date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
    body: article.body || [], imagePosition: article.image_position || 'center',
    image: media(article.image_url, fallback?.image || NEWS[0].image),
  }
}

export function StudioNewsProvider({ children }) {
  const { status, data } = useStudioApi('/studio/news')
  const ok = status === 'ok' && Array.isArray(data)
  const failed = status === 'error' || (status === 'ok' && !ok)
  const value = { articles: ok ? data.map(mapArticle) : failed ? NEWS : [], loading: status === 'loading', fallback: failed }
  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>
}

export function useStudioNews() { return useContext(NewsContext) }
