import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import CtaBanner from '../components/CtaBanner'
import { PlatformIcons } from '../components/GameCard'
import PageBanner from '../components/PageBanner'
import Partners from '../components/Partners'
import { useStudioGames } from '../hooks/useStudioGames'
import ComingSoon from './ComingSoon'
import check from '../assets/games/check.png'

export default function GameDetail() {
  const { slug } = useParams()
  const { games, loading } = useStudioGames()
  const game = games.find((item) => item.slug === slug)
  if (loading && !game) return <div className="container-studio py-24">Loading game�</div>
  if (!game) return <ComingSoon title="Game not found" />

  return (
    <>
      <PageBanner title="Game Details" trail={[{ label: 'Games', to: '/games' }, { label: game.title }]} />

      <article className="container-studio pt-[68px] pb-24 lg:pb-[97px]">
        {/* Picture + stats */}
        <div className="grid gap-5 lg:grid-cols-[844fr_405fr]">
          <div className="overflow-hidden rounded-[8px] border border-cyan">
            <img
              src={game.image}
              alt={`${game.title} artwork`}
              fetchpriority="high"
              className="aspect-[844/531] size-full object-cover"
              style={{ objectPosition: game.detailImagePosition }}
            />
          </div>

          <aside className="glass-card glass-card-cyan flex flex-col px-[47px] pt-[47px] pb-10" aria-label="Game stats">
            <PlatformIcons platforms={game.platforms} />
            <dl className="mt-[50px] space-y-[34px]">
              <div className="flex flex-col-reverse">
                <dt className="font-display text-[16px] leading-[1.3]">Downloads</dt>
                <dd className="font-display text-[36px] leading-[1.3] font-bold text-cyan">{game.downloads}</dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="font-display text-[16px] leading-[1.3]">({game.reviews} Review)</dt>
                <dd className="font-display text-[36px] leading-[1.3] font-bold text-cyan">
                  {game.rating}<span className="sr-only"> out of 5</span>
                </dd>
              </div>
            </dl>
            {/* No store link yet: the button goes to Contact so it never dead-ends. */}
            {game.downloadUrl ? (
              <Button href={game.downloadUrl} target="_blank" rel="noopener noreferrer" icon={false} className="mt-[34px] w-fit">Download now</Button>
            ) : (
              <Button to="/contact" icon={false} className="mt-[34px] w-fit">Download now</Button>
            )}
          </aside>
        </div>

        {/* About */}
        <div className="mt-12 max-w-[844px]">
          <h2 className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <span className="font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]">{game.title}</span>
            <span className="font-display text-[16px] leading-[1.02] text-cyan">{game.genre}</span>
          </h2>
          <p className="mt-5 font-lato text-[17px] leading-[1.18] sm:text-[20px]">{game.description}</p>

          <h2 className="mt-12 font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]">Top Features:</h2>
          <p className="mt-5 font-lato text-[17px] leading-[1.18] sm:text-[20px]">{game.featuresIntro}</p>
          <ul className="mt-7 space-y-5">
            {game.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-[19px] font-lato text-[17px] leading-[1.18] sm:text-[20px]">
                <span aria-hidden className="grid size-[26px] shrink-0 place-items-center rounded-full bg-[#0656f3]">
                  <img src={check} alt="" className="size-2.5" />
                </span>
                <span className="pt-0.5">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <Partners />
      <CtaBanner />
    </>
  )
}
