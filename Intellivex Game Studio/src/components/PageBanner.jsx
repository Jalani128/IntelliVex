import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import banner from '../assets/games/page-banner.jpg'
import chevron from '../assets/games/breadcrumb-chevron.svg'

/**
 * Inner-page header: neon light streaks behind a centred title and breadcrumb
 * (Figma "background 1", masked to fade out from 199px to 234px).
 * `trail` lists the crumbs after Home: [{ label, to? }] — the last one is the current page.
 */
export default function PageBanner({ title, trail = [] }) {
  const crumbs = [{ label: 'Home', to: '/' }, ...trail]
  return (
    <section className="relative isolate -mt-[79px] flex h-[266px] flex-col items-center justify-end pb-[66px] text-center">
      <img
        src={banner}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-x-0 top-0 -z-10 h-[350px] w-full object-cover [mask-image:linear-gradient(to_bottom,#000_199px,transparent_234px)]"
      />
      <h1 className="font-display text-[28px] leading-[1.02] font-bold uppercase sm:text-[36px]">{title}</h1>
      <nav aria-label="Breadcrumb" className="mt-2.5">
        <ol className="flex flex-wrap items-center justify-center gap-x-3 font-display text-[14px] leading-[1.02] tracking-[0.06em] uppercase sm:text-[16px]">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1
            return (
              <Fragment key={c.label}>
                {i > 0 && <li aria-hidden><img src={chevron} alt="" className="h-2 w-[11px]" /></li>}
                <li>
                  {last || !c.to ? (
                    <span aria-current={last ? 'page' : undefined}>{c.label}</span>
                  ) : (
                    <Link to={c.to} className="transition-colors duration-300 hover:text-cyan-nav">{c.label}</Link>
                  )}
                </li>
              </Fragment>
            )
          })}
        </ol>
      </nav>
    </section>
  )
}
