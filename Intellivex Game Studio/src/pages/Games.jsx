import RevealItem from '../components/RevealItem'
import { useSearchParams } from 'react-router-dom'
import CtaBanner from '../components/CtaBanner'
import GameCard from '../components/GameCard'
import PageBanner from '../components/PageBanner'
import Partners from '../components/Partners'
import { GAME_CATEGORIES } from '../data/games'
import { useStudioGames } from '../hooks/useStudioGames'
import PageLoader from '../components/PageLoader'

const DEFAULT_CATEGORY = 'mobile'

/* Category rows: the selected one is the glowing blue button, the rest a blue gradient (Figma 564:398–407). */
const ROW = 'flex h-[49px] w-full shrink-0 items-center gap-4 rounded-[10px] px-[18px] text-left font-inter text-[16px] leading-[0.95] whitespace-nowrap transition-[filter,box-shadow] duration-300 sm:text-[18px] lg:whitespace-normal'
const ROW_IDLE = 'bg-[linear-gradient(172.7deg,#1053a8_3.3%,#04174f_93.5%)] hover:brightness-125'
const ROW_ACTIVE = 'bg-blue shadow-[0_0_60px_0_rgba(3,105,250,0.7),inset_0_-3.3px_1.7px_rgba(0,0,0,0.25),inset_0_1.7px_0.8px_rgba(255,255,255,0.25)]'

export default function Games() {
  const [params, setParams] = useSearchParams()
  const active = GAME_CATEGORIES.some((c) => c.key === params.get('category')) ? params.get('category') : DEFAULT_CATEGORY
  const activeLabel = GAME_CATEGORIES.find((c) => c.key === active).label
  const { games: allGames, loading } = useStudioGames()
  const games = allGames.filter((g) => g.categories.includes(active))

  const choose = (key) => setParams(key === DEFAULT_CATEGORY ? {} : { category: key }, { replace: true, preventScrollReset: true })

  if (loading) return <PageLoader />
  return (
    <>
      <PageBanner title="Games" trail={[{ label: 'Games' }]} />

      <section className="container-studio grid gap-10 pt-[34px] pb-24 lg:grid-cols-[296px_1fr] lg:gap-[31px] lg:pb-[97px]">
        {/* Categories */}
        <aside className="glass-card glass-card-cyan h-fit min-w-0 p-4 lg:px-[18px] lg:pt-[22px] lg:pb-[21px]">
          <h2 className="px-0.5 font-inter text-[20px]">Categories</h2>
          <ul className="mt-3.5 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pb-0">
            {GAME_CATEGORIES.map((c) => {
              const on = c.key === active
              return (
                <li key={c.key} className="shrink-0 lg:shrink">
                  <button type="button" onClick={() => choose(c.key)} aria-pressed={on} className={`${ROW} ${on ? ROW_ACTIVE : ROW_IDLE}`}>
                    <img src={c.icon} alt="" aria-hidden className="size-[24px] shrink-0 object-contain" />
                    {c.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        {/* Games */}
        <div aria-live="polite">
          <h2 className="sr-only">{activeLabel}</h2>
          {games.length ? (
            <ul className="grid gap-x-[31px] gap-y-12 pb-10 sm:grid-cols-2 sm:gap-y-[74px] xl:grid-cols-3">
              {games.map((game, i) => (
                <RevealItem key={game.slug} index={i}><GameCard game={game} /></RevealItem>
              ))}
            </ul>
          ) : (
            <div className="glass-card grid min-h-[300px] place-content-center px-6 text-center">
              <p className="font-display text-[22px] font-semibold">No {activeLabel.toLowerCase()} yet</p>
              <p className="mt-2 text-mist">New titles are on the way. Pick another category to see what’s playable now.</p>
            </div>
          )}
        </div>
      </section>

      <Partners />
      <CtaBanner />
    </>
  )
}
