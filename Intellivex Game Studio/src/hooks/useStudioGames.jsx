import { createContext, useContext } from 'react'
import { GAMES } from '../data/games'
import { media, useStudioApi } from '../lib/studioApi'

const GamesContext = createContext({ games: [], loading: true })

function mapGame(game) {
  const fallback = GAMES.find((item) => item.slug === game.slug)
  return {
    slug: game.slug, title: game.title, genre: game.genre || '',
    image: media(game.image_url, fallback?.image || GAMES[0].image),
    imagePosition: game.image_position || 'center', detailImagePosition: game.detail_image_position || 'center',
    description: game.description || '', featuresIntro: game.features_intro || '', features: game.features || [],
    platforms: game.platforms || [], categories: game.categories || [], downloads: game.downloads || '—',
    rating: game.rating || '—', reviews: game.reviews || '—', downloadUrl: game.download_url || null,
  }
}

export function StudioGamesProvider({ children }) {
  const { status, data } = useStudioApi('/studio/games')
  const ok = status === 'ok' && Array.isArray(data)
  const value = { games: status === 'loading' ? [] : ok ? data.map(mapGame) : GAMES, loading: status === 'loading' }
  return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
}

export function useStudioGames() { return useContext(GamesContext) }
