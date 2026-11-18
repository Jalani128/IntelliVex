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

const QUOTE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

export const TESTIMONIALS = [
  { quote: QUOTE, name: 'Mickael Grants', role: 'CEO of Apples to Oranges', avatar: testimonialAvatar, rating: 5 },
  { quote: QUOTE, name: 'Mickael Grants', role: 'CEO of Apples to Oranges', avatar: testimonialAvatar, rating: 5 },
  { quote: QUOTE, name: 'Mickael Grants', role: 'CEO of Apples to Oranges', avatar: testimonialAvatar, rating: 5 },
]
