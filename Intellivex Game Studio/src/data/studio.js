/**
 * Our Studio page content (Figma "Our Studio", node 568:28).
 * Names, roles, quotes and copy are the design's placeholders until the real ones arrive.
 */
import studioPhoto from '../assets/studio/studio-photo.jpg'
import team1 from '../assets/studio/team-1.jpg'
import team2 from '../assets/studio/team-2.jpg'
import team3 from '../assets/studio/team-3.jpg'
import team4 from '../assets/studio/team-4.jpg'
import testimonialAvatar from '../assets/studio/testimonial-avatar.jpg'

const LOREM = 'Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng'

export const ABOUT = {
  eyebrow: 'About Intellivex Studio',
  title: ['We Build Platforms', 'That Empower Gamers'],
  text: 'Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem',
  photo: studioPhoto,
}

export const VISION_MISSION = [
  { title: 'Our Vision', text: LOREM },
  { title: 'Our Mission', text: LOREM },
]

export { STATS } from './home'

export const TEAM = [
  { name: 'Person name', role: 'Art Director', photo: team1 },
  { name: 'Person name', role: 'Art Director', photo: team2 },
  { name: 'Person name', role: 'Art Director', photo: team3 },
  { name: 'Person name', role: 'Art Director', photo: team4 },
]

// Sample entries so the carousel visibly changes — not real clients. Replace with real, approved quotes before launch.
export const TESTIMONIALS = [
  {
    quote: 'Sample testimonial 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    name: 'Client Name One',
    role: 'Company One (sample)',
    avatar: testimonialAvatar,
    rating: 5,
  },
  {
    quote: 'Sample testimonial 2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
    name: 'Client Name Two',
    role: 'Company Two (sample)',
    avatar: testimonialAvatar,
    rating: 5,
  },
  {
    quote: 'Sample testimonial 3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    name: 'Client Name Three',
    role: 'Company Three (sample)',
    avatar: testimonialAvatar,
    rating: 5,
  },
]
