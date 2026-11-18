import SectionHeading from './SectionHeading'
import { PARTNERS } from '../data/home'

function LogoRow({ hidden = false }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-16 pr-16 lg:gap-24 lg:pr-24">
      {PARTNERS.map((p, i) => (
        <li key={i} className="shrink-0">
          <img src={p.logo} alt={hidden ? '' : p.name} loading="lazy" style={{ width: p.width }} className="h-10 max-w-none object-contain opacity-80 transition-opacity duration-300 hover:opacity-100" />
        </li>
      ))}
    </ul>
  )
}

/** Partner logos sliding in an endless loop, shared by most pages. Pauses on hover; still for reduced motion. */
export default function Partners() {
  return (
    <section className="container-studio pb-16 lg:pb-[68px]">
      <SectionHeading eyebrow="Our Partners" title="Trusted by Amazing Partners" />
      <div className="group mt-[57px] overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <LogoRow />
          <LogoRow hidden />
        </div>
      </div>
    </section>
  )
}
