import { useEffect, useRef, useState } from 'react'
import CtaBanner from '../components/CtaBanner'
import PageBanner from '../components/PageBanner'
import Partners from '../components/Partners'
import { useStudioProfile } from '../hooks/useStudioProfile'
import teamCard from '../assets/studio/team-card.jpg'
import stars from '../assets/studio/stars.svg'
import PageLoader from '../components/PageLoader'

export default function Studio() {
  const profile = useStudioProfile()
  if (profile.loading) return <PageLoader />
  return (
    <>
      <PageBanner title="Our Studio" trail={[{ label: 'Our Studio' }]} />
      <About about={profile.about} />
      <VisionMission items={profile.visionMission} />
      <Stats stats={profile.stats} />
      {profile.members.length > 0 && <Team members={profile.members} eyebrow={profile.teamEyebrow} title={profile.teamTitle} />}
      {profile.reviews.length > 0 && <Testimonials key={profile.reviews.map((item) => item.id ?? item.name).join('|')} items={profile.reviews} eyebrow={profile.reviewsEyebrow} title={profile.reviewsTitle} />}
      <Partners />
      <CtaBanner />
    </>
  )
}

/** Cyan eyebrow over a 36px title — this page's heading style. */
function Heading({ eyebrow, children, center = false, id }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <p className="font-display text-[18px] tracking-[0.06em] text-cyan sm:text-[20px]">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]">{children}</h2>
    </div>
  )
}

function ArrowButton({ direction, onClick, disabled, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-white/40 transition-colors duration-300 hover:border-cyan hover:text-cyan disabled:opacity-40 disabled:hover:border-white/40 disabled:hover:text-white"
    >
      <svg viewBox="0 0 16 16" aria-hidden className={`size-4 ${direction === 'prev' ? 'rotate-180' : ''}`}>
        <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

/* ---------- About ---------- */

function About({ about }) {
  return (
    <section className="container-studio pt-[66px]">
      <div className="grid gap-6 lg:grid-cols-[1fr_470px] lg:items-start">
        <Heading eyebrow={about.eyebrow}>
          {about.title[0]}<br className="hidden sm:block" /> {about.title[1]}
        </Heading>
        <p className="font-lato text-[17px] leading-[1.4] sm:text-[20px]">{about.text}</p>
      </div>
      <img
        src={about.photo}
        alt="A player at a gaming desk with two curved monitors"
        className="mt-10 aspect-[1269/736] w-full rounded-[8px] border border-cyan object-cover lg:mt-[53px]"
      />
    </section>
  )
}

/* ---------- Vision / Mission ---------- */

function VisionMission({ items }) {
  return (
    <section className="container-studio mt-[46px] grid gap-[57px] gap-y-6 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="glass-card glass-card-cyan rounded-[8px] px-8 py-8 sm:px-[57px] sm:pt-10 sm:pb-11">
          <h2 className="font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]">{item.title}</h2>
          <p className="mt-4 font-lato text-[17px] leading-[1.4] sm:text-[20px]">{item.text}</p>
        </div>
      ))}
    </section>
  )
}

/* ---------- Stats ---------- */

function Stats({ stats }) {
  return (
    <section aria-label="Studio in numbers" className="container-studio mt-[59px]">
      <dl className="grid grid-cols-2 gap-8 lg:flex lg:justify-between">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="mt-1 font-display text-[16px] font-medium sm:text-[20px]">{s.label}</dt>
            <dd className="text-stat font-display text-[36px] leading-[1.1] font-bold sm:text-[48px]">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ---------- Team ---------- */

function TeamCard({ member }) {
  return (
    <figure className="group relative h-[375px] w-[286px] shrink-0 snap-center sm:snap-start">
      {/* Tilted glass plate (Figma "Rectangle 25"), drawn larger than the card for its glow. */}
      <img src={teamCard} alt="" aria-hidden className="pointer-events-none absolute top-[-7.44%] left-[-20.98%] h-[131.2%] w-[141.9%] max-w-none transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-2" />
      <div className="relative flex h-full flex-col items-center pt-[71px] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-2">
        <div className="rounded-full border border-cyan p-0.5">
          {member.photo ? <img src={member.photo} alt="" loading="lazy" className="size-[139px] rounded-full object-cover" /> : <div aria-hidden className="grid size-[139px] place-items-center rounded-full bg-blue/20 font-display text-4xl text-cyan">{member.name?.slice(0, 1)}</div>}
        </div>
        <figcaption className="mt-[43px] text-center">
          <p className="font-display text-[20px] font-semibold tracking-[0.06em]">{member.name}</p>
          <p className="mt-1.5 font-display text-[16px] tracking-[0.06em] text-cyan">{member.role}</p>
        </figcaption>
      </div>
    </figure>
  )
}

function Team({ members, eyebrow, title }) {
  const track = useRef(null)
  const scroll = (dir) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * 321, behavior: 'smooth' })
  }

  return (
    <section id="team" aria-labelledby="team-title" className="container-studio mt-[150px] scroll-mt-24 overflow-x-clip">
      <Heading eyebrow={eyebrow} id="team-title">{title}</Heading>
      <div
        ref={track}
        className={`-mx-4 mt-[63px] flex snap-x snap-mandatory gap-[35px] overflow-x-auto px-[calc(50%-143px)] sm:scroll-px-[76px] sm:px-[76px] pt-8 pb-16 [scrollbar-width:none] ${members.length <= 4 ? 'min-[1360px]:mx-0 min-[1360px]:justify-between min-[1360px]:overflow-visible min-[1360px]:px-[13px]' : ''}`}
      >
        {members.map((member, i) => <TeamCard key={member.id ?? i} member={member} />)}
      </div>
      {/* Four cards (with their tilted plates) only fit side by side from ~1360px; below that the row scrolls. */}
      <div className={`mt-2 flex justify-center gap-4 ${members.length <= 4 ? 'min-[1360px]:hidden' : ''}`}>
        <ArrowButton direction="prev" label="Previous team members" onClick={() => scroll(-1)} />
        <ArrowButton direction="next" label="Next team members" onClick={() => scroll(1)} />
      </div>
    </section>
  )
}

/* ---------- Testimonials ---------- */

/** `rel` = position relative to the centred card: 0 is active, negative is left, positive is right. */
function TestimonialCard({ item, rel, still }) {
  const active = rel === 0
  return (
    <figure
      aria-hidden={active ? undefined : true}
      className={`flex min-h-[206px] w-[var(--w)] shrink-0 flex-col justify-between rounded-[6px] border bg-[linear-gradient(180deg,rgba(7,249,251,0.06),rgba(1,5,32,0.6))] px-[25px] py-[27px] ${
        still ? '' : 'transition-[opacity,transform,border-color,box-shadow] duration-700 ease-[var(--ease-out-soft)]'
      } ${
        active
          ? 'border-cyan/70 shadow-[0_0_60px_rgba(7,249,251,0.12),inset_0_0_40px_rgba(7,249,251,0.08)]'
          : `scale-[0.908] border-cyan/40 opacity-50 ${rel < 0 ? '[mask-image:linear-gradient(270deg,#000_40%,transparent)]' : '[mask-image:linear-gradient(90deg,#000_40%,transparent)]'}`
      }`}
    >
      <blockquote className="font-inter text-[15px] leading-[1.45] text-[#c2c4c8] sm:text-[16px]">{item.quote}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3.5">
        {item.avatar ? <img src={item.avatar} alt="" loading="lazy" className="size-11 rounded-full object-cover grayscale" /> : <span aria-hidden className="grid size-11 place-items-center rounded-full bg-blue/20 font-display text-cyan">{item.name?.slice(0, 1)}</span>}
        <span className="flex-1">
          <span className="block font-inter text-[15px] text-[#c2c4c8]">{item.name}</span>
          <span className="block font-inter text-[12px] text-[#8c9193]">{item.role}</span>
        </span>
        <img src={stars} alt={`Rated ${item.rating} out of 5`} className="h-[22px] w-auto" />
      </figcaption>
    </figure>
  )
}

const AUTOPLAY_MS = 5000

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Testimonials({ items, eyebrow, title }) {
  const n = items.length
  // The list is rendered three times; `pos` stays in the middle copy, so there is always a card on each side.
  const slides = [...items, ...items, ...items]
  const [pos, setPos] = useState(n)
  const [still, setStill] = useState(false)
  const [paused, setPaused] = useState(false)
  const wrap = (p) => n + ((((p - n) % n) + n) % n)

  const go = (dir) => {
    setStill(false)
    setPos((p) => {
      const next = p + dir
      if (reducedMotion()) return wrap(next) // no transition → no transitionend to re-centre on
      return Math.min(Math.max(next, 0), slides.length - 1)
    })
  }

  // After sliding past the middle copy, jump back to the identical card there without animating.
  const onSlid = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
    if (pos < n || pos >= 2 * n) {
      setStill(true)
      setPos(wrap(pos))
    }
  }

  useEffect(() => {
    if (!still) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setStill(false)))
    return () => cancelAnimationFrame(id)
  }, [still])

  // Advances on its own; any change (arrow or timer) restarts the countdown.
  useEffect(() => {
    if (paused || reducedMotion() || n < 2) return
    const id = setTimeout(() => go(1), AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [pos, paused, n]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      aria-labelledby="testimonials-title"
      aria-roledescription="carousel"
      className="mt-[160px] overflow-hidden pb-24 lg:pb-[127px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-studio">
        <Heading eyebrow={eyebrow} center id="testimonials-title">{title}</Heading>
      </div>
      {/* Card width and gap; side cards are scaled to 442px, so a 10px gap reads as the design's 33px. */}
      <div className="mt-[58px] [--gap:16px] [--w:min(487px,calc(100vw-32px))] lg:[--gap:10px]" aria-live={paused ? 'polite' : 'off'}>
        <div
          onTransitionEnd={onSlid}
          style={{ transform: `translateX(calc(${-pos} * (var(--w) + var(--gap))))` }}
          className={`ml-[calc(50%-var(--w)/2)] flex w-max items-center gap-[var(--gap)] ${still ? '' : 'transition-transform duration-700 ease-[var(--ease-out-soft)]'}`}
        >
          {slides.map((item, i) => <TestimonialCard key={i} item={item} rel={i - pos} still={still} />)}
        </div>
      </div>
      <div className="mt-[53px] flex justify-center gap-4">
        <ArrowButton direction="prev" label="Previous testimonial" onClick={() => go(-1)} disabled={n < 2} />
        <ArrowButton direction="next" label="Next testimonial" onClick={() => go(1)} disabled={n < 2} />
      </div>
    </section>
  )
}
