import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import CtaBanner from '../components/CtaBanner'
import PageBanner from '../components/PageBanner'
import Partners from '../components/Partners'
import { findJob } from '../data/careers'
import ComingSoon from './ComingSoon'
import check from '../assets/games/check.png'

const H2 = 'font-display text-[28px] leading-[1.02] font-semibold tracking-[0.06em] sm:text-[36px]'
const BODY = 'font-lato text-[17px] leading-[1.18] sm:text-[19.5px]'

export default function CareerDetail() {
  const { slug } = useParams()
  const job = findJob(slug)
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
          {job.applyUrl ? (
            <Button href={job.applyUrl} target="_blank" rel="noopener noreferrer" icon={false} className="mt-[50px] w-fit">Apply now</Button>
          ) : (
            <Button to="/contact" icon={false} className="mt-[50px] w-fit">Apply now</Button>
          )}
        </aside>
      </article>

      <Partners />
      <CtaBanner />
    </>
  )
}
