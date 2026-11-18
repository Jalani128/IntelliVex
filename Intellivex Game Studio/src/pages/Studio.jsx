import { useRef, useState } from 'react'
import CtaBanner from '../components/CtaBanner'
import PageBanner from '../components/PageBanner'
import Partners from '../components/Partners'
import { ABOUT, STATS, TEAM, TESTIMONIALS, VISION_MISSION } from '../data/studio'
import teamCard from '../assets/studio/team-card.jpg'
import stars from '../assets/studio/stars.svg'

export default function Studio() {
  return (
    <>
      <PageBanner title="Our Studio" trail={[{ label: 'Our Studio' }]} />
      <About />
      <VisionMission />
      <Stats />
      <Team />
      <Testimonials />
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

function About() {
  return (
    <section className="container-studio pt-[66px]">
      <div className="grid gap-6 lg:grid-cols-[1fr_470px] lg:items-start">
        <Heading eyebrow={ABOUT.eyebrow}>
          {ABOUT.title[0]}<br className="hidden sm:block" /> {ABOUT.title[1]}
        </Heading>
        <p className="font-lato text-[17px] leading-[1.4] sm:text-[20px]">{ABOUT.text}</p>
      </div>
      <img
        src={ABOUT.photo}
        alt="A player at a gaming desk with two curved monitors"
        className="mt-10 aspect-[1269/736] w-full rounded-[8px] border border-cyan object-cover lg:mt-[53px]"
      />
    </section>
  )
}

/* ---------- Vision / Mission ---------- */

function VisionMission() {
  return (
    <section className="container-studio mt-[46px] grid gap-[57px] gap-y-6 md:grid-cols-2">
      {VISION_MISSION.map((item) => (
        <div key={item.title} className="glass-card glass-card-cyan rounded-[8px] px-8 py-8 sm:px-[57px] sm:pt-10 sm:pb-11">
          <h2 className="font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]">{item.title}</h2>
          <p className="mt-4 font-lato text-[17px] leading-[1.4] sm:text-[20px]">{item.text}</p>
        </div>
      ))}
    </section>
  )
}

/* ---------- Stats ---------- */

function Stats() {
  return (
    <section aria-label="Studio in numbers" className="container-studio mt-[59px]">
      <dl className="grid grid-cols-2 gap-8 lg:flex lg:justify-between">
        {STATS.map((s) => (
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
    <figure className="group relative h-[375px] w-[286px] shrink-0 snap-start">
      {/* Tilted glass plate (Figma "Rectangle 25"), drawn larger than the card for its glow. */}
      <img src={teamCard} alt="" aria-hidden className="pointer-events-none absolute top-[-7.44%] left-[-20.98%] h-[131.2%] w-[141.9%] max-w-none transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-2" />
      <div className="relative flex h-full flex-col items-center pt-[71px] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-2">
        <div className="rounded-full border border-cyan p-0.5">
          <img src={member.photo} alt="" loading="lazy" className="size-[139px] rounded-full object-cover" />
        </div>
        <figcaption className="mt-[43px] text-center">
          <p className="font-display text-[20px] font-semibold tracking-[0.06em]">{member.name}</p>
          <p className="mt-1.5 font-display text-[16px] tracking-[0.06em] text-cyan">{member.role}</p>
        </figcaption>
      </div>
    </figure>
  )
}

function Team() {
  const track = useRef(null)
  const scroll = (dir) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * 321, behavior: 'smooth' })
  }

  return (
    <section id="team" aria-labelledby="team-title" className="container-studio mt-[150px] scroll-mt-24">
      <Heading eyebrow="Meet The Crew" id="team-title">Team Members</Heading>
      <div
        ref={track}
        className="-mx-4 mt-[63px] flex snap-x snap-mandatory gap-[35px] overflow-x-auto px-[calc(1rem+60px)] pt-8 pb-16 [scrollbar-width:none] lg:mx-0 lg:justify-between lg:overflow-visible lg:px-[13px]"
      >
        {TEAM.map((member, i) => <TeamCard key={i} member={member} />)}
      </div>
      {/* Arrows page the row once there are more people than fit (and on small screens). */}
      <div className={`mt-2 flex justify-center gap-4 ${TEAM.length <= 4 ? 'lg:hidden' : ''}`}>
        <ArrowButton direction="prev" label="Previous team members" onClick={() => scroll(-1)} />
        <ArrowButton direction="next" label="Next team members" onClick={() => scroll(1)} />
      </div>
    </section>
  )
}

/* ---------- Testimonials ---------- */

function TestimonialCard({ item, side }) {
  return (
    <figure
      className={`flex w-full flex-col justify-between rounded-[6px] border bg-[linear-gradient(180deg,rgba(7,249,251,0.06),rgba(1,5,32,0.6))] transition-all duration-500 ease-[var(--ease-out-soft)] ${
        side
          ? 'min-h-[186px] max-w-[442px] border-cyan/40 px-[21px] py-[27px] opacity-50 [mask-image:linear-gradient(90deg,#000_40%,transparent)] data-[side=left]:[mask-image:linear-gradient(270deg,#000_40%,transparent)]'
          : 'min-h-[206px] max-w-[487px] border-cyan/70 px-[25px] py-[27px] shadow-[0_0_60px_rgba(7,249,251,0.12),inset_0_0_40px_rgba(7,249,251,0.08)]'
      }`}
      data-side={side}
    >
      <blockquote className="font-inter text-[15px] leading-[1.45] text-[#c2c4c8] sm:text-[16px]">{item.quote}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3.5">
        <img src={item.avatar} alt="" loading="lazy" className="size-11 rounded-full object-cover grayscale" />
        <span className="flex-1">
          <span className="block font-inter text-[15px] text-[#c2c4c8]">{item.name}</span>
          <span className="block font-inter text-[12px] text-[#8c9193]">{item.role}</span>
        </span>
        <img src={stars} alt={`Rated ${item.rating} out of 5`} className="h-[22px] w-auto" />
      </figcaption>
    </figure>
  )
}

function Testimonials() {
  const [index, setIndex] = useState(0)
  const n = TESTIMONIALS.length
  const at = (offset) => TESTIMONIALS[(index + offset + n) % n]

  return (
    <section aria-labelledby="testimonials-title" className="mt-[160px] overflow-hidden pb-24 lg:pb-[127px]">
      <div className="container-studio">
        <Heading eyebrow="What people’s say about us" center id="testimonials-title">Testimonials</Heading>
      </div>
      <div className="mt-[58px] grid items-center gap-[33px] px-4 lg:grid-cols-[442px_487px_442px] lg:justify-center lg:px-0" aria-live="polite">
        <div className="hidden justify-end lg:flex"><TestimonialCard item={at(-1)} side="left" /></div>
        <div className="flex justify-center"><TestimonialCard item={at(0)} /></div>
        <div className="hidden lg:flex"><TestimonialCard item={at(1)} side="right" /></div>
      </div>
      <div className="mt-[53px] flex justify-center gap-4">
        <ArrowButton direction="prev" label="Previous testimonial" onClick={() => setIndex((i) => (i - 1 + n) % n)} />
        <ArrowButton direction="next" label="Next testimonial" onClick={() => setIndex((i) => (i + 1) % n)} />
      </div>
    </section>
  )
}
