import { useEffect, useState } from 'react'
import Button from './Button'

const INTERVAL = 6000

/* Copy placement inside the 1276px content box, from the three Figma frames:
   slide 1 flush right (x=999), slide 2 at x=125, slide 3 at x=443 and lower. */
const ALIGN = {
  right: 'lg:ml-auto lg:w-[360px]',
  left: 'lg:ml-[43px] lg:w-[360px]',
  center: 'lg:ml-[361px] lg:mt-[150px]',
}

export default function HeroSlider({ slides, page }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce || slides.length < 2) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL)
    return () => clearTimeout(id)
  }, [index, paused, slides.length])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative isolate -mt-[79px] h-[640px] overflow-hidden sm:h-[716px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === index
        return (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={!active}
            inert={active ? undefined : ''}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${active ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
          >
            {/* Artwork fades into the page at the bottom (Figma mask: solid to 81%, gone by 97%). */}
            <img
              src={slide.image}
              alt=""
              fetchpriority={i === 0 ? 'high' : 'low'}
              className={`absolute inset-0 size-full object-cover transition-transform duration-[7000ms] ease-out [mask-image:linear-gradient(to_bottom,#000_81%,transparent_97%)] ${active ? 'scale-100' : 'scale-105'} ${slide.align === 'left' ? 'object-[70%_50%]' : slide.align === 'right' ? 'object-[30%_50%]' : 'object-center'}`}
            />
            {/* Keeps the copy readable on small screens, where it sits over the art. */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent lg:hidden" />

            <div className="relative flex h-full items-end pb-24 lg:items-center lg:pb-0">
              <div className="container-studio">
                <div
                  className={`transition-all delay-200 duration-700 ease-[var(--ease-out-soft)] ${ALIGN[slide.align]} ${active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                >
                  <p className="font-display text-[14px] tracking-[0.14em] uppercase sm:text-[16px]">{slide.eyebrow}</p>
                  {i === 0 ? <h1 className="sr-only">IntelliVex Studios</h1> : null}
                  <p className="mt-2 font-display text-[32px] leading-[1.02] font-extrabold tracking-[0.14em] uppercase sm:text-[42px]">
                    <span className="block">{slide.lines[0]}</span>
                    <span className="text-neon block">{slide.lines[1]}</span>
                    <span className="text-neon block">{slide.lines[2]}</span>
                  </p>
                  {slide.text && (
                    <p className="mt-4 max-w-[355px] font-display text-[15px] leading-[1.5] text-mist">{slide.text}</p>
                  )}
                  <div className={`mt-6 flex gap-4 ${slide.align === 'center' ? 'flex-wrap' : 'flex-col items-start'}`}>
                    <Button href="#featured-games">{page?.text('hero_demo_button', 'Watch demo') ?? 'Watch demo'}</Button>
                    <Button to="/games">{page?.text('hero_games_button', 'Explore our games') ?? 'Explore our games'}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            className="grid h-6 place-items-center"
          >
            <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-cyan shadow-[0_0_12px_#07f9fb]' : 'w-3 bg-white/40 hover:bg-white/70'}`} />
          </button>
        ))}
      </div>
    </section>
  )
}
