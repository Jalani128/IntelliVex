import { Link, useSearchParams } from 'react-router-dom'
import CtaBanner from '../components/CtaBanner'
import PageBanner from '../components/PageBanner'
import Pagination from '../components/Pagination'
import Partners from '../components/Partners'
import { NEWS } from '../data/news'
import readMoreArrow from '../assets/home/read-more-arrow.png'

const PER_PAGE = 6

function ArticleCard({ item }) {
  return (
    <article className="glass-card glass-card-cyan group relative flex h-full flex-col p-4 pb-6 transition-transform duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5">
      <div className="overflow-hidden rounded-[15.6px]">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="aspect-[373/197] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
          style={{ objectPosition: item.imagePosition }}
        />
      </div>
      <div className="flex flex-1 flex-col px-[13px] pt-[21px]">
        <time className="font-display text-[16px] leading-[1.02] tracking-[0.06em] text-cyan">{item.date}</time>
        <h3 className="mt-3 font-display text-[26px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[31px]">{item.title}</h3>
        <p className="mt-2.5 font-lato text-[17px] leading-[1.18] sm:text-[19.5px]">{item.excerpt}</p>
        <Link
          to={`/news/${item.slug}`}
          className="mt-auto inline-flex w-fit items-center gap-2.5 pt-4 font-lato text-[12px] font-bold text-cyan uppercase after:absolute after:inset-0 after:rounded-[16px] hover:underline"
        >
          Read more
          <img src={readMoreArrow} alt="" aria-hidden className="h-3 w-[13px] rotate-90 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

export default function News() {
  const [params, setParams] = useSearchParams()
  const pages = Math.max(1, Math.ceil(NEWS.length / PER_PAGE))
  const current = Math.min(Math.max(1, Number(params.get('page')) || 1), pages)
  const shown = NEWS.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  return (
    <>
      <PageBanner title="News" trail={[{ label: 'News' }]} />

      <section className="container-studio pt-[80px] pb-24 lg:pb-[97px]" aria-labelledby="news-title">
        <p className="font-display text-[20px] tracking-[0.06em] text-cyan sm:text-[24px]">News and Articles</p>
        <h2 id="news-title" className="mt-2 font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]">Latest News</h2>

        <ul className="mt-10 grid gap-x-[22px] gap-y-[39px] md:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => <li key={item.slug}><ArticleCard item={item} /></li>)}
        </ul>

        <Pagination
          current={current}
          pages={pages}
          onChange={(n) => setParams(n > 1 ? { page: n } : {}, { preventScrollReset: true })}
          className="mt-[51px]"
        />
      </section>

      <Partners />
      <CtaBanner />
    </>
  )
}
