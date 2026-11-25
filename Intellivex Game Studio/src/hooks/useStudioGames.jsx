import { createContext, useContext, useEffect, useState } from 'react'
import { GAMES } from '../data/games'

const GamesContext = createContext({ games: GAMES, loading: true })
const API = (import.meta.env.VITE_STUDIO_API_URL || 'https://api.theintellivex.com/intellivex/public/api').replace(/\/$/, '')
const MEDIA = (import.meta.env.VITE_STUDIO_MEDIA_URL || 'https://api.theintellivex.com/intellivex/public/storage').replace(/\/$/, '')

function mapGame(game) {
  const fallback = GAMES.find((item) => item.slug === game.slug)
  const image = game.image_url
  const storagePath = image?.indexOf('/storage/')
  return {
    slug: game.slug, title: game.title, genre: game.genre || '',
    image: image ? (storagePath >= 0 ? `${MEDIA}/${image.slice(storagePath + 9)}` : image) : fallback?.image || GAMES[0].image,
    imagePosition: game.image_position || 'center', detailImagePosition: game.detail_image_position || 'center',
    description: game.description || '', featuresIntro: game.features_intro || '', features: game.features || [],
    platforms: game.platforms || [], categories: game.categories || [], downloads: game.downloads || '—',
    rating: game.rating || '—', reviews: game.reviews || '—', downloadUrl: game.download_url || null,
  }
}

export function StudioGamesProvider({ children }) {
  const [state, setState] = useState({ games: GAMES, loading: true })
  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const timeout = setTimeout(() => controller.abort(), 8000)
    fetch(`${API}/studio/games`, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw new Error('Game API unavailable'); return response.json() })
      .then((response) => { if (!Array.isArray(response.data)) throw new Error('Invalid game data'); if (active) setState({ games: response.data.map(mapGame), loading: false }) })
      .catch(() => { if (active) setState({ games: GAMES, loading: false }) })
      .finally(() => clearTimeout(timeout))
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [])
  return <GamesContext.Provider value={state}>{children}</GamesContext.Provider>
}

export function useStudioGames() { return useContext(GamesContext) }
