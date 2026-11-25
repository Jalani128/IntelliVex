import { createContext, useContext } from 'react'
import { JOBS } from '../data/careers'
import { useStudioApi } from '../lib/studioApi'

export { STUDIO_API } from '../lib/studioApi'

const CareerContext = createContext({ jobs: [], loading: true, fallback: false })

function mapJob(job) {
  return {
    slug: job.slug, title: job.title, category: job.category, summary: job.summary || '',
    sections: [{ title: null, text: job.description || '' }, { title: 'Requirements', text: job.requirements || '' }, { title: 'Why Intellivex studio', text: job.why_join || '' }],
    perks: job.perks || [], facts: [
      { label: 'Salary', value: job.salary }, { label: 'Type', value: job.employment_type },
      { label: 'Location', value: job.location }, { label: 'Experience', value: job.experience },
      { label: 'Work mode', value: job.work_mode }, { label: 'Posted', value: job.posted_at },
    ].filter((item) => item.value),
  }
}

export function StudioCareersProvider({ children }) {
  const { status, data } = useStudioApi('/studio/jobs')
  const ok = status === 'ok' && Array.isArray(data)
  const failed = status === 'error' || (status === 'ok' && !ok)
  const value = { jobs: ok ? data.map(mapJob) : failed ? JOBS : [], loading: status === 'loading', fallback: failed }
  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>
}

export function useStudioCareers() { return useContext(CareerContext) }
