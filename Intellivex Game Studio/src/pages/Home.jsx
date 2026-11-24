import RevealItem from '../components/RevealItem'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useStudioGames } from '../hooks/useStudioGames'
import { useStudioHome } from '../hooks/useStudioHome'
import { useStudioNews } from '../hooks/useStudioNews'
import CtaBanner from '../components/CtaBanner'
import GameCard from '../components/GameCard'
import HeroSlider from '../components/HeroSlider'
import Partners from '../components/Partners'
import SectionHeading from '../components/SectionHeading'
import {
  EXPERTISE, HERO_SLIDES, LATEST_NEWS, PLATFORMS, STATS, STUDIO_FEATURES,
} from '../data/home'
import lineH from '../assets/home/line-h.svg'
import lineV from '../assets/home/line-v.svg'
import worldFrame from '../assets/home/world-frame.svg'
import world from '../assets/home/world.png'
import dividerV from '../assets/home/divider-v.svg'
import dividerH from '../assets/home/divider-h.svg'
import btsBg from '../assets/home/bts-bg.jpg'
import btsVideo from '../assets/home/bts-video.jpg'
import btsCar from '../assets/home/bts-car.png'
import play from '../assets/home/play.png'
import navBase from '../assets/home/nav-base.png'
import navArrow from '../assets/home/nav-arrow.svg'
import readMoreArrow from '../assets/home/read-more-arrow.png'

export default function Home() {
  const page = useStudioHome()
  const slides = HERO_SLIDES.map((slide, i) => ({
    ...slide,
    image: page.image(`hero_${i}`, slide.image),
    eyebrow: page.text(`hero_${i}_eyebrow`, slide.eyebrow),
    lines: slide.lines.map((line, n) => page.text(`hero_${i}_line_${n}`, line)),
    text: page.text(`hero_${i}_text`, slide.text),
  }))
  return (
    <>
      <HeroSlider slides={slides} page={page} />
      <PlatformsBar page={page} />
      <FeaturedGames page={page} />
      <StudioIntro page={page} />
      <Expertise page={page} />
      <BehindTheScenes page={page} />
      <LatestNews page={page} />
      <Partners />
      <CtaBanner page={page} />
    </>
  )
}

/* ---------- Platforms strip ---------- */

function PlatformsBar({ page }) {
  return (
    <section aria-label="Platforms" className="relative">
      <img src={lineH} alt="" aria-hidden className="block h-px w-full" />
      <ul className="container-studio grid grid-cols-2 gap-y-6 py-6 sm:grid-cols-3 lg:flex lg:justify-between lg:py-[22px]">
        {PLATFORMS.map((p, i) => (
          <li key={p.label} className="flex items-center lg:contents">
            <div className="group flex flex-1 flex-col items-center gap-3 text-center">
              <img src={page.image(`platform_${i}`, p.icon)} alt="" aria-hidden className="size-[50px] object-contain transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:scale-110" />
              <span className="font-inter text-[15px] text-white sm:text-[18px]">{page.text(`platform_${i}_label`, p.label)}</span>
            </div>
            {i < PLATFORMS.length - 1 && (
              <span aria-hidden className="relative hidden h-[65px] w-px self-center lg:block">
                <img src={lineV} alt="" className="absolute top-1/2 left-1/2 h-px w-[65px] max-w-none -translate-1/2 rotate-90" />
              </span>
            )}
          </li>
        ))}
      </ul>
      <img src={lineH} alt="" aria-hidden className="block h-px w-full" />
    </section>
  )
}

/* ---------- Featured games ---------- */

function FeaturedGames({ page }) {
  const { games } = useStudioGames()
  return (
    <section id="featured-games" className="container-studio scroll-mt-24 pt-20 pb-28 lg:pt-[104px] lg:pb-[110px]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow={page.text('games_eyebrow', 'Featured Games')} title={page.text('games_title', 'Bring Imagination to Life')} />
        <Button to="/games">{page.text('games_button', 'View all games')}</Button>
      </div>
      <ul className="mt-12 grid gap-x-[31px] gap-y-12 sm:grid-cols-2 sm:gap-y-20 lg:mt-[104px] lg:grid-cols-4">
        {games.map((game, i) => (
          <RevealItem key={game.slug} index={i}><GameCard game={game} /></RevealItem>
        ))}
      </ul>
    </section>
  )
}

/* ---------- Studio intro ("We Build Extraordinary Worlds") ---------- */

function StudioIntro({ page }) {
  return (
    <section className="relative overflow-hidden py-16 lg:py-[48px]">
      <div className="container-studio relative grid items-center lg:grid-cols-[1fr_auto] lg:min-h-[612px]">
        {/* Angled backdrop behind the card */}
        <img src={worldFrame} alt="" aria-hidden className="pointer-events-none absolute top-[49px] left-[-20px] hidden h-[563px] w-[990px] rotate-180 lg:block" />

        <div className="glass-card glass-card-cyan relative z-10 max-w-[610px] px-6 py-8 sm:px-[55px] sm:pt-[34px] sm:pb-[38px] lg:ml-[43px]">
          <p className="font-display text-[14px] tracking-[0.14em] uppercase sm:text-[16px]">{page.text('intro_eyebrow', 'Featured Games')}</p>
          <h2 className="mt-2.5 font-display text-[28px] leading-[1.02] font-bold tracking-[0.06em] sm:text-[36px]">
            {page.text('intro_line_0', 'We Build')}<br />{page.text('intro_line_1', 'Extraordinary Worlds')}
          </h2>

          <div className="relative mt-7 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-[36px]">
            <img src={dividerH} alt="" aria-hidden className="absolute top-1/2 left-0 hidden h-px w-full sm:block" />
            <img src={dividerV} alt="" aria-hidden className="absolute top-1/2 left-1/2 hidden h-px w-[140px] max-w-none -translate-1/2 rotate-90 sm:block" />
            {STUDIO_FEATURES.map((f, i) => (
              <div key={f.label} className="flex items-center gap-4">
                <img src={page.image(`feature_${i}`, f.icon)} alt="" aria-hidden className="size-[38px] shrink-0 object-contain" />
                <p className="max-w-[150px] font-display text-[18px] leading-[1.02] font-medium">{page.text(`feature_${i}_label`, f.label)}</p>
              </div>
            ))}
          </div>

          <Button to="/studio" className="mt-[34px]">{page.text('intro_button', 'Discover our Studio')}</Button>
        </div>

        <img
          src={page.image('world', world)}
          alt="A floating island world from an IntelliVex game"
          loading="lazy"
          className="mx-auto mt-10 w-full max-w-[560px] animate-float motion-reduce:animate-none lg:-mt-12 lg:mr-[-44px] lg:w-[657px] lg:max-w-none"
        />
      </div>
    </section>
  )
}

/* ---------- Expertise ---------- */

function Expertise({ page }) {
  return (
    <section className="container-studio py-16 lg:pt-[67px] lg:pb-[125px]">
      <SectionHeading eyebrow={page.text('expertise_eyebrow', 'Our Expertise')} title={page.text('expertise_title', 'From Concept to Complete Game')} />
      <ul className="mt-[62px] grid grid-cols-2 gap-[37px] gap-y-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-y-0">
        {EXPERTISE.map((item, i) => (
          <li key={item.title.join(' ')} className="group relative aspect-[182/272] overflow-hidden rounded-[5px] border-[0.6px] border-cyan">
            <img
              src={page.image(`expertise_${i}`, item.image)}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-110"
              style={{ objectPosition: item.imagePosition }}
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-b from-ink/0 from-[21%] to-ink to-[61%]" />
            <h3 className="absolute inset-x-2 bottom-[18px] text-center font-display text-[13px] leading-[1.1] font-semibold sm:text-[14.76px]">
              <span className="block">{page.text(`expertise_${i}_line_0`, item.title[0])}</span>
              <span className="block">{page.text(`expertise_${i}_line_1`, item.title[1])}</span>
            </h3>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- Behind the scenes ---------- */

function CarouselArrow({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous video' : 'Next video'}
      className="relative grid size-[42px] place-items-center transition-transform duration-300 hover:scale-110"
    >
      <img src={navBase} alt="" aria-hidden className="absolute size-[35px] -rotate-45 opacity-90" />
      <img src={navArrow} alt="" aria-hidden className={`relative h-[9.5px] w-2.5 ${direction === 'prev' ? 'rotate-180' : ''}`} />
    </button>
  )
}

function BehindTheScenes({ page }) {
  // One studio video for now; the arrows will page through more once the CMS supplies them.
  const [slide, setSlide] = useState(0)
  const videos = [page.image('behind_video', btsVideo)]
  const go = (step) => setSlide((s) => (s + step + videos.length) % videos.length)

  return (
    <section className="relative isolate overflow-hidden pt-6 pb-16 lg:h-[814px] lg:pb-0">
      <img src={page.image('behind_background', btsBg)} alt="" aria-hidden loading="lazy" className="absolute inset-0 -z-10 size-full object-cover opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_50%,transparent_88%)]" />

      <div className="container-studio relative">
        <SectionHeading eyebrow={page.text('behind_eyebrow', 'Behind the Scenes')} title={page.text('behind_title', 'Where Idea Become Real')} />

        <div className="mt-10 grid gap-10 lg:mt-[63px] lg:grid-cols-[501px_1fr_303px] lg:gap-0">
          {/* Video card */}
          <div className="glass-card relative h-fit self-start px-4 py-5 sm:px-[10px] lg:mt-[24px]">
            <div className="flex items-center gap-1">
              <CarouselArrow direction="prev" onClick={() => go(-1)} />
              <button type="button" className="group relative flex-1 overflow-hidden rounded-[5px] border-[0.6px] border-cyan/60" aria-label="Play studio video">
                <img src={videos[slide]} alt="Developers at work in the IntelliVex studio" loading="lazy" className="aspect-[383/231] w-full object-cover" />
                <img src={play} alt="" aria-hidden className="absolute top-1/2 left-1/2 size-[50px] -translate-1/2 transition-transform duration-300 group-hover:scale-110" />
              </button>
              <CarouselArrow direction="next" onClick={() => go(1)} />
            </div>
          </div>

          {/* Car — sits between the cards on wide screens */}
          <img src={page.image('behind_car', btsCar)} alt="" aria-hidden loading="lazy" className="hidden self-end lg:mb-[-80px] lg:ml-[-96px] lg:block lg:w-[504px] lg:max-w-none" />

          {/* Stats */}
          <div className="glass-card py-[42px] pr-4 pl-[43px] lg:h-[436px]">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-[39px] lg:grid-cols-1">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1.5 font-display text-[16px] leading-[1.02] font-medium sm:text-[18px]">{page.text(`stat_${i}_label`, s.label)}</dt>
                  <dd className="text-stat font-display text-[36px] leading-[1.02] font-bold">{page.text(`stat_${i}_value`, s.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <Button to="/studio" className="mt-8 lg:mt-[35px] lg:ml-[114px]">{page.text('behind_button', 'Watch Studio Videos')}</Button>
      </div>
    </section>
  )
}

/* ---------- Latest news ---------- */

export function NewsCard({ item }) {
  return (
    <article className="glass-card animated-editorial-card group flex h-full flex-col overflow-hidden">
      <div className="overflow-hidden rounded-[5px] border-[0.6px] border-cyan/60">
        <img src={item.image} alt="" loading="lazy" className="aspect-[413/249] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col px-7 pt-[43px] pb-8">
        <time className="font-lato text-[12px] font-bold text-cyan">{item.date}</time>
        <h3 className="mt-2 font-lato text-[22px] leading-tight font-bold sm:text-[24px]">{item.title}</h3>
        <p className="mt-3 max-w-[356px] font-lato text-[16px] leading-[1.18]">{item.excerpt}</p>
        <Link
          to={`/news/${item.slug}`}
          className="mt-auto inline-flex w-fit items-center gap-2.5 pt-3 font-lato text-[12px] font-bold text-cyan uppercase after:absolute after:inset-0 hover:underline"
        >
          Read more
          <img src={readMoreArrow} alt="" aria-hidden className="h-3 w-[13px] rotate-90 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

function LatestNews({ page }) {
  const { articles, fallback } = useStudioNews()
  const latest = fallback ? LATEST_NEWS : articles.slice(0, 3)
  return (
    <section className="container-studio py-16 lg:pt-[50px] lg:pb-[117px]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow={page.text('news_eyebrow', 'Latest News')} title={page.text('news_title', 'Stories, Updates & Milestones')} />
        <Button to="/news">{page.text('news_button', 'View all news')}</Button>
      </div>
      <ul className="mt-[47px] grid gap-[21px] md:grid-cols-2 lg:grid-cols-3">
        {latest.map((item, i) => (
          <RevealItem key={item.slug} index={i}><NewsCard item={item} /></RevealItem>
        ))}
      </ul>
    </section>
  )
}
