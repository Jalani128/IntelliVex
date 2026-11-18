/**
 * News articles (Figma News 601:46, News Details 616:323). Headings, dates and text
 * are the design's placeholders until the Admin panel manages them.
 */
import news1 from '../assets/news/news-1.jpg'
import news2 from '../assets/news/news-2.jpg'
import news3 from '../assets/news/news-3.jpg'
import news4 from '../assets/news/news-4.jpg'
import news5 from '../assets/news/news-5.jpg'
import metroLife from '../assets/home/game-metro-life.jpg'

const LOREM = 'Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. '

const item = (n, image, imagePosition = 'center') => ({
  slug: `news-${n}`,
  date: 'July 4, 2026',
  title: 'Heading here',
  excerpt: 'Lorem ipsum dolor sitamet const adipiscng.',
  // Article paragraphs on the detail page.
  body: [LOREM.repeat(5).trim(), LOREM.repeat(2).trim()],
  image,
  imagePosition,
})

export const NEWS = [
  item(1, news1),
  item(2, news2),
  item(3, news4, 'center 30%'),
  item(4, metroLife),
  item(5, news3),
  item(6, news5),
]

export const findNews = (slug) => NEWS.find((n) => n.slug === slug)
