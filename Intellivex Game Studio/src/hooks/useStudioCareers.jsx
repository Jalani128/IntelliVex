import { createContext, useContext, useEffect, useState } from 'react'
import { JOBS } from '../data/careers'

const CareerContext = createContext({ jobs: JOBS, loading: true, fallback: true })
export const STUDIO_API = (import.meta.env.VITE_STUDIO_API_URL || 'https://api.theintellivex.com/intellivex/public/api').replace(/\/$/, '')

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
  const [state, setState] = useState({ jobs: JOBS, loading: true, fallback: true })
  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let active = true
    fetch(`${STUDIO_API}/studio/jobs`, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw new Error('Careers API unavailable'); return response.json() })
      .then((response) => { if (!Array.isArray(response.data)) throw new Error('Invalid careers data'); if (active) setState({ jobs: response.data.map(mapJob), loading: false, fallback: false }) })
      .catch(() => { if (active) setState({ jobs: JOBS, loading: false, fallback: true }) })
      .finally(() => clearTimeout(timeout))
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [])
  return <CareerContext.Provider value={state}>{children}</CareerContext.Provider>
}

export function useStudioCareers() { return useContext(CareerContext) }
