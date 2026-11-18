/**
 * Home page content (Figma "Intellivex" → Home, node 526:790).
 * Kept here until the Admin panel manages the studio's content.
 */
import heroSlide1 from '../assets/home/hero-dragon-city.jpg'
import heroSlide2 from '../assets/home/hero-slide-2.jpg'
import heroSlide3 from '../assets/home/hero-slide-3.jpg'
import catMobile from '../assets/home/cat-mobile.png'
import catWeb from '../assets/home/cat-web.png'
import catPc from '../assets/home/cat-pc.png'
import catConsole from '../assets/home/cat-console.png'
import catCloud from '../assets/home/cat-cloud.png'
import catImmersive from '../assets/home/cat-immersive.png'
import shadowRealms from '../assets/home/game-shadow-realms.jpg'
import metroLife from '../assets/home/game-metro-life.jpg'
import buildVerse from '../assets/home/game-build-verse.jpg'
import baristaRush from '../assets/home/game-barista-rush.jpg'
import exp2d3d from '../assets/home/exp-2d3d.jpg'
import expGameDev from '../assets/home/exp-gamedev.jpg'
import expArVr from '../assets/home/exp-arvr.jpg'
import expLiveOps from '../assets/home/exp-liveops.jpg'
import featIp from '../assets/home/feat-ip.png'
import featCross from '../assets/home/feat-cross.png'
import featTech from '../assets/home/feat-tech.png'
import featGlobal from '../assets/home/feat-global.png'
import news1 from '../assets/home/news-1.jpg'
import news2 from '../assets/home/news-2.jpg'
import news3 from '../assets/home/news-3.jpg'
import partner1 from '../assets/home/partner-1.png'
import partner2 from '../assets/home/partner-2.png'
import partner3 from '../assets/home/partner-3.png'

const HERO_COPY = {
  eyebrow: 'Game development studio',
  lines: ['Create.', 'Play.', 'Experience.'],
  text: 'Our team consists of highly skilled professionals who have a deep understanding of the game development.',
}

/** Three hero slides; `align` places the copy where each artwork leaves room for it. */
export const HERO_SLIDES = [
  { image: heroSlide1, align: 'right', ...HERO_COPY },
  { image: heroSlide2, align: 'left', ...HERO_COPY },
  { image: heroSlide3, align: 'center', ...HERO_COPY, text: null },
]

export const PLATFORMS = [
  { label: 'Mobile Games', icon: catMobile },
  { label: 'Web Games', icon: catWeb },
  { label: 'PC Games', icon: catPc },
  { label: 'Console Games', icon: catConsole },
  { label: 'Cloud Gaming', icon: catCloud },
  { label: 'Immersive Experiences', icon: catImmersive },
]

/** `platforms` picks the small icons under the genre (pc, mobile, console). */
export const FEATURED_GAMES = [
  { slug: 'shadow-realms', title: 'Shadow Realms', genre: 'Action RPG', image: shadowRealms, imagePosition: '30% 0%', platforms: ['pc', 'mobile', 'console'] },
  { slug: 'metro-life', title: 'Metro Life', genre: 'Racing / Simulation', image: metroLife, imagePosition: '52% 0%', platforms: ['pc', 'mobile', 'console'] },
  { slug: 'build-verse', title: 'Build Verse', genre: 'Creative Sandbox', image: buildVerse, imagePosition: '17% 0%', platforms: ['pc', 'mobile', 'console'] },
  { slug: 'barista-rush', title: 'Barista Rush', genre: 'Simulation', image: baristaRush, imagePosition: '52% 30%', platforms: ['pc', 'mobile', 'console'] },
]

export const STUDIO_FEATURES = [
  { label: 'Original IP Development', icon: featIp },
  { label: 'Cross-Platform Expertise', icon: featCross },
  { label: 'Cutting Edge Technology', icon: featTech },
  { label: 'Global Audience Focus.', icon: featGlobal },
]

export const EXPERTISE = [
  { title: ['Game Design', '& Production'], image: shadowRealms, imagePosition: '30% 25%' },
  { title: ['2D & 3D Art', '& Animation'], image: exp2d3d, imagePosition: '45% 40%' },
  { title: ['Game Development', '(PC, Console, Mobile)'], image: expGameDev, imagePosition: '6% 0%' },
  { title: ['Multiplayer &', 'Online Games'], image: metroLife, imagePosition: '55% 0%' },
  { title: ['AR/VR & Immersive', 'Experiences'], image: expArVr, imagePosition: '50% 35%' },
  { title: ['Live Ops & Game', 'Support'], image: expLiveOps, imagePosition: '22% 0%' },
]

export const STATS = [
  { value: '10+', label: 'Games in Development' },
  { value: '50+', label: 'Talented Creators' },
  { value: '06+', label: 'Platforms' },
  { value: 'Global', label: 'Audience Focused' },
]

const LOREM_TITLE = 'Lorem ipsum dolor sit amet consectetur'
const LOREM_TEXT = 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer'

export const LATEST_NEWS = [
  { slug: 'news-1', date: '20 Oct 2026', title: LOREM_TITLE, excerpt: LOREM_TEXT, image: news1 },
  { slug: 'news-2', date: '20 Oct 2026', title: LOREM_TITLE, excerpt: LOREM_TEXT, image: news2 },
  { slug: 'news-3', date: '20 Oct 2026', title: LOREM_TITLE, excerpt: LOREM_TEXT, image: news3 },
]

/** Placeholder partner logos from the design (width in px at 40px tall). */
export const PARTNERS = [
  { name: 'Partner', logo: partner3, width: 104 },
  { name: 'Logoipsum', logo: partner1, width: 186 },
  { name: 'Partner', logo: partner2, width: 86 },
  { name: 'Partner', logo: partner3, width: 104 },
  { name: 'Partner', logo: partner2, width: 86 },
  { name: 'Logoipsum', logo: partner1, width: 186 },
]
