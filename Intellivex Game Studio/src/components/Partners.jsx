import SectionHeading from './SectionHeading'
import { PARTNERS } from '../data/home'
import { media, useStudioApi } from '../lib/studioApi'

/** Published partners from the CMS; the built-in logos only when the API fails or has none with a logo. */
function usePartners() {
  const { status, data } = useStudioApi('/studio/partners')
  if (status === 'loading') return []
  const list = (Array.isArray(data) ? data : []).filter((p) => p.image_url).map((p) => ({ name: p.name, logo: media(p.image_url) }))
  return list.length ? list : PARTNERS
}

function LogoRow({ hidden = false, partners }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-16 pr-16 lg:gap-24 lg:pr-24">
      {partners.map((p, i) => (
        <li key={i} className="shrink-0">
          <img src={p.logo} alt={hidden ? '' : p.name} loading="lazy" style={p.width ? { width: p.width } : undefined} className="h-10 w-auto max-w-[200px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100" />
        </li>
      ))}
    </ul>
  )
}

/** Partner logos sliding in an endless loop, shared by most pages. Pauses on hover; still for reduced motion. */
export default function Partners() {
  const partners = usePartners()
  return (
    <section className="container-studio pb-16 lg:pb-[68px]">
      <SectionHeading eyebrow="Our Partners" title="Trusted by Amazing Partners" />
      <div className="group mt-[57px] overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <LogoRow partners={partners} />
          <LogoRow partners={partners} hidden />
        </div>
      </div>
    </section>
  )
}
