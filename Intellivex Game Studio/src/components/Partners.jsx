import SectionHeading from './SectionHeading'
import { PARTNERS } from '../data/home'

/** Partner logo row, shared by most pages. */
export default function Partners() {
  return (
    <section className="container-studio pb-16 lg:pb-[68px]">
      <SectionHeading eyebrow="Our Partners" title="Trusted by Amazing Partners" />
      <ul className="mt-[57px] flex flex-wrap items-center justify-center gap-x-12 gap-y-8 lg:justify-between">
        {PARTNERS.map((p, i) => (
          <li key={i}>
            <img src={p.logo} alt={p.name} loading="lazy" style={{ width: p.width }} className="h-10 object-contain opacity-80 transition-opacity duration-300 hover:opacity-100" />
          </li>
        ))}
      </ul>
    </section>
  )
}
