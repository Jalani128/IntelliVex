import RevealItem from '../components/RevealItem'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CtaBanner from '../components/CtaBanner'
import PageBanner from '../components/PageBanner'
import Pagination from '../components/Pagination'
import Partners from '../components/Partners'
import { useStudioCareers } from '../hooks/useStudioCareers'
import searchIcon from '../assets/careers/search.svg'
import chevron from '../assets/careers/chevron-down.svg'
import readMoreArrow from '../assets/home/read-more-arrow.png'

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
  const { jobs: allJobs } = useStudioCareers()
  const categories = [...new Set(allJobs.map((job) => job.category))]
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const page = Math.max(1, Number(params.get('page')) || 1)
  // The form edits a draft; Search (or Enter) applies it to the URL.
  const [draft, setDraft] = useState({ q, category })

  const term = q.trim().toLowerCase()
  const jobs = allJobs.filter(
    (j) => (!category || j.category === category) && (!term || `${j.title} ${j.summary} ${j.category}`.toLowerCase().includes(term)),
  )
  const pages = Math.max(1, Math.ceil(jobs.length / PER_PAGE))
  const current = Math.min(page, pages)
  const shown = jobs.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const update = (next) => {
    const merged = { q, category, page: current, ...next }
    const clean = Object.fromEntries(Object.entries(merged).filter(([k, v]) => v && !(k === 'page' && v === 1)))
    setParams(clean, { replace: true, preventScrollReset: true })
  }

  const submit = (e) => {
    e.preventDefault()
    update({ q: draft.q.trim(), category: draft.category, page: 1 })
  }

  return (
    <>
      <PageBanner title="Careers" trail={[{ label: 'Careers' }]} />

      <section className="container-studio pt-[66px] pb-24 lg:pb-[97px]" aria-labelledby="jobs-title">
        <p className="font-display text-[20px] tracking-[0.06em] text-cyan sm:text-[24px]">Open Roles</p>
        <h2 id="jobs-title" className="mt-2 font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]">Now Hiring</h2>

        <form onSubmit={submit} role="search" className="mt-[50px] grid gap-4 sm:grid-cols-[1fr_174px] lg:grid-cols-[1fr_174px_213px] lg:gap-6">
          <label className="relative block sm:col-span-2 lg:col-span-1">
            <span className="sr-only">Search roles</span>
            <img src={searchIcon} alt="" aria-hidden className="pointer-events-none absolute top-1/2 left-[22px] size-5 -translate-y-1/2" />
            <input
              type="search"
              value={draft.q}
              onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
              placeholder="Search....."
              className={`${FIELD} w-full pr-4 pl-[55px] placeholder:text-[#8c99a7]`}
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Category</span>
            <select
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              className={`${FIELD} w-full appearance-none pr-12 pl-[22px] [&>option]:bg-ink`}
            >
              <option value="">Category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <img src={chevron} alt="" aria-hidden className="pointer-events-none absolute top-1/2 right-[22px] h-2 w-4 -translate-y-1/2 rotate-180" />
          </label>
          <button
            type="submit"
            className="h-14 rounded-[10px] bg-blue font-display text-[14px] font-semibold uppercase shadow-[0_0_80px_0_rgba(3,105,250,0.6),inset_0_-3.3px_1.7px_rgba(0,0,0,0.25),inset_0_1.7px_0.8px_rgba(255,255,255,0.25)] transition-[filter] duration-300 hover:brightness-110"
          >
            Search
          </button>
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
                onClick={() => { setDraft({ q: '', category: '' }); setParams({}, { replace: true, preventScrollReset: true }) }}
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
