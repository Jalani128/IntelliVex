import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import CtaBanner from '../components/CtaBanner'
import PageBanner from '../components/PageBanner'
import Partners from '../components/Partners'
import { STUDIO_API, useStudioCareers } from '../hooks/useStudioCareers'
import ComingSoon from './ComingSoon'
import check from '../assets/games/check.png'

const H2 = 'font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]'
const BODY = 'font-lato text-[17px] leading-[1.18] sm:text-[19.5px]'

export default function CareerDetail() {
  const { slug } = useParams()
  const { jobs, loading, fallback } = useStudioCareers()
  const job = jobs.find((item) => item.slug === slug)
  if (loading && !job) return <div className="container-studio py-24">Loading role…</div>
  if (!job) return <ComingSoon title="Role not found" />

  const [intro, ...sections] = job.sections

  return (
    <>
      <PageBanner title="Careers Details" trail={[{ label: 'Careers', to: '/careers' }, { label: 'Careers Details' }]} />

      <article className="container-studio grid gap-12 pt-[66px] pb-24 lg:grid-cols-[798fr_405fr] lg:gap-[66px] lg:pb-[150px]">
        <div>
          <p className="font-display text-[20px] leading-[1.02] tracking-[0.06em] text-cyan sm:text-[24px]">Open Role</p>
          <h2 className={`mt-4 ${H2}`}>{job.title}</h2>
          <p className={`mt-5 ${BODY}`}>{intro.text}</p>

          {sections.map((s) => (
            <section key={s.title} className="mt-[60px]">
              <h2 className={H2}>{s.title}</h2>
              <p className={`mt-5 ${BODY}`}>{s.text}</p>
            </section>
          ))}

          <section className="mt-[100px]">
            <h2 className={H2}>Benefits &amp; perks</h2>
            <ul className="mt-8 space-y-5">
              {job.perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-[19px] font-lato text-[17px] leading-[1.18] sm:text-[20px]">
                  <span aria-hidden className="grid size-[26px] shrink-0 place-items-center rounded-full bg-[#0656f3]">
                    <img src={check} alt="" className="size-2.5" />
                  </span>
                  <span className="pt-0.5">{perk}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside aria-label="Role details" className="glass-card glass-card-cyan h-fit px-8 pt-[37px] sm:px-[66px] pb-9 lg:min-h-[581px]">
          <dl className="space-y-5">
            {job.facts.map((f) => (
              <div key={f.label}>
                <dt className="font-display text-[24px] leading-[1.3] font-bold text-cyan">{f.label}</dt>
                <dd className="font-display text-[16px] leading-[1.3]">{f.value}</dd>
              </div>
            ))}
          </dl>
          {fallback ? (
            <Button to="/contact" icon={false} className="mt-[50px] w-fit">Apply now</Button>
          ) : (
            <Button href="#apply" icon={false} className="mt-[50px] w-fit">Apply now</Button>
          )}
        </aside>
      </article>

      {!fallback && <ApplicationForm slug={job.slug} />}

      <Partners />
      <CtaBanner />
    </>
  )
}

function ApplicationForm({ slug }) {
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setState('sending'); setMessage('')
    try {
      const response = await fetch(`${STUDIO_API}/studio/jobs/${encodeURIComponent(slug)}/applications`, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to submit your application. Please try again.')
      form.reset(); setState('success'); setMessage('Your application has been submitted successfully.')
    } catch (error) { setState('error'); setMessage(error.message || 'Unable to submit your application. Please try again.') }
  }
  const input = 'w-full rounded-lg border border-cyan bg-ink px-4 py-3 font-lato text-base text-white'
  return <section id="apply" className="container-studio scroll-mt-24 pb-24">
    <form onSubmit={submit} className="glass-card glass-card-cyan mx-auto max-w-3xl space-y-5 p-6 sm:p-10">
      <h2 className={H2}>Apply for this role</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2"><span>Name</span><input className={input} name="name" required maxLength={150} autoComplete="name" /></label>
        <label className="block space-y-2"><span>Email</span><input className={input} type="email" name="email" required maxLength={254} autoComplete="email" /></label>
        <label className="block space-y-2"><span>Phone (optional)</span><input className={input} name="phone" type="tel" maxLength={30} autoComplete="tel" /></label>
        <label className="block space-y-2"><span>CV (PDF, DOC or DOCX; max 5 MB)</span><input className={input} name="cv" type="file" accept=".pdf,.doc,.docx" required /></label>
      </div>
      <label className="block space-y-2"><span>Message (optional)</span><textarea className={input} name="message" rows={5} maxLength={5000} /></label>
      <button type="submit" disabled={state === 'sending'} className="rounded-xl bg-blue px-6 py-3 font-display font-semibold disabled:opacity-50">{state === 'sending' ? 'Sending…' : 'Submit application'}</button>
      {message && <p role={state === 'error' ? 'alert' : 'status'} className="font-lato text-base">{message}</p>}
    </form>
  </section>
}
