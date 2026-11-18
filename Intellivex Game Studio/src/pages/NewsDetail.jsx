import { Link, useParams } from 'react-router-dom'
import CtaBanner from '../components/CtaBanner'
import PageBanner from '../components/PageBanner'
import Partners from '../components/Partners'
import { findNews, NEWS } from '../data/news'
import ComingSoon from './ComingSoon'

export default function NewsDetail() {
  const { slug } = useParams()
  const post = findNews(slug)
  if (!post) return <ComingSoon title="Article not found" />

  const recent = NEWS.filter((n) => n.slug !== slug).slice(0, 4)

  return (
    <>
      <PageBanner title="News Details" trail={[{ label: 'News', to: '/news' }, { label: 'News Details' }]} />

      <div className="container-studio grid gap-12 pt-[66px] pb-24 lg:grid-cols-[844fr_405fr] lg:gap-5 lg:pb-[120px]">
        <article>
          <img
            src={post.image}
            alt=""
            fetchpriority="high"
            className="aspect-[844/531] w-full rounded-[8px] border border-cyan object-cover"
            style={{ objectPosition: post.imagePosition }}
          />
          <h2 className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <span className="font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]">{post.title}</span>
            <time className="font-display text-[16px] leading-[1.02] font-normal tracking-[0.06em] text-cyan">{post.date}</time>
          </h2>
          {post.body.map((p, i) => (
            <p key={i} className="mt-[46px] font-lato text-[17px] leading-[1.18] first-of-type:mt-[17px] sm:text-[20px]">{p}</p>
          ))}
        </article>

        <aside aria-labelledby="recent-title" className="glass-card glass-card-cyan h-fit px-6 pt-[37px] sm:px-[41px] pb-9 lg:min-h-[565px]">
          <h2 id="recent-title" className="font-display text-[24px] leading-[1.02] font-semibold tracking-[0.06em]">Recent Posts</h2>
          <ul className="mt-[31px] space-y-8">
            {recent.map((n) => (
              <li key={n.slug}>
                <Link to={`/news/${n.slug}`} className="group flex gap-[21px]">
                  <img
                    src={n.image}
                    alt=""
                    loading="lazy"
                    className="h-[85px] w-[120px] shrink-0 rounded-[7px] object-cover"
                    style={{ objectPosition: n.imagePosition }}
                  />
                  <span className="flex flex-col justify-between">
                    <span className="line-clamp-2 font-display text-[20px] leading-[1.23] font-semibold tracking-[0.06em] transition-colors duration-300 group-hover:text-cyan">{n.title}</span>
                    <time className="font-display text-[16px] leading-[1.02] tracking-[0.06em] text-cyan">{n.date}</time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <Partners />
      <CtaBanner />
    </>
  )
}
