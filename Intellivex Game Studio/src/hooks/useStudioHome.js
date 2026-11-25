import { media, useStudioApi } from '../lib/studioApi'

export function useStudioHome() {
  const { status, data } = useStudioApi('/studio/home')
  const page = status === 'ok' && data ? data : { content: {}, images: {} }
  const text = (key, fallback) => page.content?.[key] ?? fallback
  const image = (key, fallback) => media(page.images?.[key], fallback)
  return { text, image, loading: status === 'loading' }
}
