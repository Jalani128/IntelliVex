import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { http } from '@/services/admin/http'
import { USE_MOCK } from '@/services/admin/config'
import { studioApplicationsMock } from '@/mock/admin/studio.mock'
import PageHeader from '@/components/admin/layout/PageHeader'
import { Button } from '@/components/ui/button'

export default function StudioApplications() {
  const [applications, setApplications] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(null)
  useEffect(() => {
    let active = true
    setLoading(true)
    const request = USE_MOCK ? Promise.resolve({ data: studioApplicationsMock, meta: { last_page: 1 } }) : http.get('/studio/applications', { params: { page, per_page: 25 } }).then((r) => r.data)
    request.then((result) => { if (active) { setApplications(result.data); setLastPage(result.meta.last_page); setError('') } })
      .catch((e) => { if (active) setError(e.message || 'Unable to load applications.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [page])
  const download = async (item) => {
    if (USE_MOCK) { toast.info('CV download needs the real API.'); return }
    setDownloading(item.id)
    try {
      const response = await http.get(`/studio/applications/${item.id}/cv`, { responseType: 'blob' })
      const url = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url; link.download = `application-${item.id}.${item.cv_extension}`; document.body.appendChild(link); link.click(); link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (e) { toast.error(e.message || 'Unable to download CV.') }
    finally { setDownloading(null) }
  }
  return <>
    <PageHeader title="Job Applications" description="Applications received for Game Studio roles." />
    {error && <p role="alert" className="text-destructive">{error}</p>}
    {loading ? <p>Loading applications…</p> : !applications.length ? <p className="rounded-xl border bg-card p-6 text-muted-foreground">No applications yet.</p> : <ul className="space-y-4">{applications.map((item) => <li key={item.id} className="space-y-2 rounded-xl border bg-card p-6"><h2 className="font-semibold">{item.name} — {item.job_title}</h2><p className="text-sm"><a className="text-brand underline" href={`mailto:${item.email}`}>{item.email}</a>{item.phone && ` · ${item.phone}`}</p><p className="text-sm text-muted-foreground">{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>{item.message && <p className="whitespace-pre-wrap text-sm">{item.message}</p>}<Button type="button" variant="outline" disabled={downloading === item.id} onClick={() => download(item)}>{downloading === item.id ? 'Downloading…' : 'Download CV'}</Button></li>)}</ul>}
    <div className="mt-4 flex items-center gap-3"><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {lastPage}</span><Button variant="outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>Next</Button></div>
  </>
}
