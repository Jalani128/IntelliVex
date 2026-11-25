import { Link } from 'react-router-dom'
import platformPc from '../assets/home/platform-pc.png'
import platformMobile from '../assets/home/platform-mobile.png'
import platformConsole from '../assets/home/platform-console.png'
import sparkle from '../assets/home/arrow.svg'

const PLATFORM_ICONS = { pc: platformPc, mobile: platformMobile, console: platformConsole }
const PLATFORM_LABELS = { pc: 'PC', mobile: 'Mobile', console: 'Console' }

export function PlatformIcons({ platforms }) {
  return (
    <ul className="flex gap-2.5" aria-label="Platforms">
      {platforms.map((p) => (
        <li key={p}>
          <img src={PLATFORM_ICONS[p]} alt={PLATFORM_LABELS[p]} title={PLATFORM_LABELS[p]} className="size-[22px] object-contain" />
        </li>
      ))}
    </ul>
  )
}

/** Game poster; on hover it lifts and a "Learn more" bar rises in (Figma "Metro Life" state). */
export default function GameCard({ game }) {
  return (
    <Link
      to={`/games/${game.slug}`}
      className="game-card group relative block h-[531px] rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
    >
      <div className="game-poster absolute inset-0 overflow-hidden rounded-[8px] border border-cyan group-hover:-translate-y-6 group-hover:border-transparent group-focus-visible:-translate-y-6">
        <img
          src={game.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
          style={{ objectPosition: game.imagePosition }}
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[256px] bg-gradient-to-b from-ink/0 from-[6%] to-ink to-[53%]" />
        <div className="absolute inset-x-[21px] bottom-[17px] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-12">
          <h3 className="font-display text-[24px] leading-[1.02] font-semibold">{game.title}</h3>
          <p className="mt-1 font-display text-[16px] leading-[1.02] text-cyan">{game.genre}</p>
          <div className="mt-[18px]"><PlatformIcons platforms={game.platforms} /></div>
        </div>
      </div>
      {/* Learn more bar */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-[-41px] flex h-[66px] translate-y-3 items-center justify-center gap-2 rounded-[24.42px] bg-blue font-display text-[14px] font-semibold uppercase opacity-0 shadow-[0_0_149px_0_#0369fa,inset_0_-3.3px_1.7px_rgba(0,0,0,0.25),inset_0_1.7px_0.8px_rgba(255,255,255,0.25)] transition-all duration-500 ease-[var(--ease-out-soft)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        Learn more <img src={sparkle} alt="" className="size-3.5" />
      </span>
    </Link>
  )
}
