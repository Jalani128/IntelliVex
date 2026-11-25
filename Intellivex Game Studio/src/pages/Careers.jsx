import RevealItem from '../components/RevealItem'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CtaBanner from '../components/CtaBanner'
import PageBanner from '../components/PageBanner'
import Pagination from '../components/Pagination'
import Partners from '../components/Partners'
import { useStudioCareers } from '../hooks/useStudioCareers'
import searchIcon from '../assets/careers/search.svg'
import readMoreArrow from '../assets/home/read-more-arrow.png'
import PageLoader from '../components/PageLoader'

const PER_PAGE = 6
const FIELD = 'h-14 rounded-[8px] border border-[#096363] bg-[#0d233a] font-lato text-[18px] text-white transition-colors duration-300 focus:border-cyan focus:outline-none sm:text-[19.5px]'

export function JobCard({ job }) {
  return (
    <article className="glass-card glass-card-cyan animated-editorial-card group relative flex h-full flex-col px-[30px] pt-[43px] pb-[42px]">
      <p className="font-display text-[20px] leading-[1.02] tracking-[0.06em] text-cyan sm:text-[23.5px]">{job.category}</p>
      <h3 className="mt-4 font-display text-[26px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[31px]">{job.title}</h3>
      <p className="mt-4 font-lato text-[17px] leading-[1.18] sm:text-[19.5px]">{job.summary}</p>
      <Link
        to={`/careers/${job.slug}`}
        className="mt-auto inline-flex w-fit items-center gap-2.5 pt-6 font-lato text-[12px] font-bold text-cyan uppercase after:absolute after:inset-0 after:rounded-[16px] hover:underline"
      >
        Read more
        <img src={readMoreArrow} alt="" aria-hidden className="h-3 w-[13px] rotate-90 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </article>
  )
}

export default function Careers() {
  const { jobs: allJobs, loading } = useStudioCareers()
  const categories = [...new Set(allJobs.map((job) => job.category))]
  const [params, setParams] = useSearchParams()
  // The input keeps its own text: the URL updates a tick later, and reading it back would drop keystrokes.
  const [q, setQ] = useState(() => params.get('q') ?? '')
  const category = params.get('category') ?? ''
  const page = Math.max(1, Number(params.get('page')) || 1)

  const term = q.trim().toLowerCase()
  const matchesTerm = (j) => !term || `${j.title} ${j.summary} ${j.category}`.toLowerCase().includes(term)
  const jobs = allJobs.filter((j) => (!category || j.category === category) && matchesTerm(j))
  // Chip counts follow the search text, so each chip says how many roles it would show.
  const counts = allJobs.filter(matchesTerm).reduce((acc, j) => ({ ...acc, [j.category]: (acc[j.category] ?? 0) + 1 }), {})
  const totalForTerm = Object.values(counts).reduce((a, b) => a + b, 0)
  const pages = Math.max(1, Math.ceil(jobs.length / PER_PAGE))
  const current = Math.min(page, pages)
  const shown = jobs.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const update = (next) => {
    if ('q' in next) setQ(next.q)
    const merged = { q, category, page: current, ...next }
    const clean = Object.fromEntries(Object.entries(merged).filter(([k, v]) => v && !(k === 'page' && v === 1)))
    setParams(clean, { replace: true, preventScrollReset: true })
  }

  const chips = [{ value: '', label: 'All roles', count: totalForTerm }, ...categories.map((c) => ({ value: c, label: c, count: counts[c] ?? 0 }))]

  if (loading) return <PageLoader />
  return (
    <>
      <PageBanner title="Careers" trail={[{ label: 'Careers' }]} />

      <section className="container-studio pt-[66px] pb-24 lg:pb-[97px]" aria-labelledby="jobs-title">
        <p className="font-display text-[20px] tracking-[0.06em] text-cyan sm:text-[24px]">Open Roles</p>
        <h2 id="jobs-title" className="mt-2 font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]">Now Hiring</h2>

        {/* Filters apply as you type or tap; the URL keeps them so results can be shared. */}
        <form onSubmit={(e) => e.preventDefault()} role="search" className="glass-card glass-card-cyan mt-[50px] p-4 sm:p-6">
          <label className="relative block">
            <span className="sr-only">Search roles</span>
            <img src={searchIcon} alt="" aria-hidden className="pointer-events-none absolute top-1/2 left-[22px] size-5 -translate-y-1/2" />
            <input
              type="search"
              value={q}
              onChange={(e) => update({ q: e.target.value, page: 1 })}
              placeholder="Search by role, skill or team"
              className={`${FIELD} w-full pr-14 pl-[55px] placeholder:text-[#8c99a7] [&::-webkit-search-cancel-button]:hidden`}
            />
            {q && (
              <button
                type="button"
                onClick={() => update({ q: '', page: 1 })}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[22px] leading-none text-[#8c99a7] transition-colors duration-300 hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            )}
          </label>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div role="group" aria-label="Filter by team" className="flex flex-wrap gap-2.5">
              {chips.map((chip) => {
                const active = category === chip.value
                return (
                  <button
                    key={chip.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update({ category: chip.value, page: 1 })}
                    className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 font-display text-[14px] font-medium tracking-[0.04em] transition-colors duration-300 ${
                      active
                        ? 'border-blue bg-blue text-white shadow-[0_0_24px_0_rgba(3,105,250,0.5)]'
                        : 'border-[#096363] bg-[#0d233a] text-white/80 hover:border-cyan hover:text-white'
                    }`}
                  >
                    {chip.label}
                    <span className={`rounded-full px-2 py-0.5 font-lato text-[12px] tabular-nums ${active ? 'bg-white/20' : 'bg-white/10 text-cyan'}`}>{chip.count}</span>
                  </button>
                )
              })}
            </div>
            <p className="font-lato text-[15px] text-[#8c99a7]" aria-live="polite">
              {jobs.length} {jobs.length === 1 ? 'role' : 'roles'}{category && ` in ${category}`}{term && ` matching “${q.trim()}”`}
            </p>
          </div>
        </form>

        <div aria-live="polite">
          {shown.length ? (
            <ul className="mt-[49px] grid gap-x-[25px] gap-y-[30px] md:grid-cols-2 lg:grid-cols-3">
              {shown.map((job, i) => <RevealItem key={job.slug} index={i}><JobCard job={job} /></RevealItem>)}
            </ul>
          ) : (
            <div className="glass-card mt-[49px] grid min-h-[260px] place-content-center px-6 text-center">
              <p className="font-display text-[22px] font-semibold">No roles match your search</p>
              <button
                type="button"
                onClick={() => update({ q: '', category: '', page: 1 })}
                className="mx-auto mt-3 font-lato text-cyan underline-offset-4 hover:underline"
              >
                Show all roles
              </button>
            </div>
          )}
        </div>

        <Pagination current={current} pages={pages} onChange={(n) => update({ page: n })} className="mt-[30px]" />
      </section>

      <Partners />
      <CtaBanner />
    </>
  )
}
