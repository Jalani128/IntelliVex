/**
 * Games catalogue (Figma Games page 559:16 and the home "Featured Games" row).
 * `platforms` = the small icons on the card; `categories` = the Games page filter.
 * Kept here until the Admin panel manages the studio's games.
 */
import shadowRealms from '../assets/home/game-shadow-realms.jpg'
import metroLife from '../assets/home/game-metro-life.jpg'
import buildVerse from '../assets/home/game-build-verse.jpg'
import baristaRush from '../assets/home/game-barista-rush.jpg'
import catMobile from '../assets/games/cat-mobile.png'
import catWeb from '../assets/games/cat-web.png'
import catPc from '../assets/games/cat-pc.png'
import catConsole from '../assets/games/cat-console.png'
import catCloud from '../assets/games/cat-cloud.png'
import catImmersive from '../assets/games/cat-immersive.png'

export const GAME_CATEGORIES = [
  { key: 'mobile', label: 'Mobile Games', icon: catMobile },
  { key: 'web', label: 'Web Games', icon: catWeb },
  { key: 'pc', label: 'PC Games', icon: catPc },
  { key: 'console', label: 'Console Games', icon: catConsole },
  { key: 'cloud', label: 'Cloud Gaming', icon: catCloud },
  { key: 'immersive', label: 'Immersive Experiences', icon: catImmersive },
]

// Every game in the design ships on PC, mobile and console (the card icons), so those are its categories.
const PLATFORMS = ['pc', 'mobile', 'console']

/* Detail page copy and stats are the design's placeholders (Figma Game Details 564:408)
   until each game's real text, numbers and store link come in. */
const DETAIL = {
  description:
    'Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin.',
  featuresIntro: 'Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng.',
  features: ['Lorem ipsum dolor sitamet const adipiscng', 'Lorem ipsum dolor sitamet const adipiscng', 'Lorem ipsum dolor sitamet const adipiscng'],
  downloads: '10M+',
  rating: '4.8',
  reviews: '2.6k',
  downloadUrl: null,
}

/** `detailImagePosition` frames the wide 844×531 picture on the detail page. */
export const GAMES = [
  { slug: 'shadow-realms', title: 'Shadow Realms', genre: 'Action RPG', image: shadowRealms, imagePosition: '30% 0%', detailImagePosition: '50% 25%', platforms: PLATFORMS, categories: PLATFORMS, ...DETAIL },
  { slug: 'metro-life', title: 'Metro Life', genre: 'Racing / Simulation', image: metroLife, imagePosition: '52% 0%', detailImagePosition: '50% 50%', platforms: PLATFORMS, categories: PLATFORMS, ...DETAIL },
  { slug: 'build-verse', title: 'Build Verse', genre: 'Creative Sandbox', image: buildVerse, imagePosition: '17% 0%', detailImagePosition: '50% 50%', platforms: PLATFORMS, categories: PLATFORMS, ...DETAIL },
  { slug: 'barista-rush', title: 'Barista Rush', genre: 'Simulation', image: baristaRush, imagePosition: '52% 30%', detailImagePosition: '50% 32%', platforms: PLATFORMS, categories: PLATFORMS, ...DETAIL },
]

export const findGame = (slug) => GAMES.find((g) => g.slug === slug)
