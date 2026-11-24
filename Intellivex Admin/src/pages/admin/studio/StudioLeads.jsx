import { useEffect, useState } from 'react'
import { http } from '@/services/admin/http'
import { USE_MOCK } from '@/services/admin/config'
import { studioInquiriesMock, studioSubscribersMock } from '@/mock/admin/studio.mock'
import PageHeader from '@/components/admin/layout/PageHeader'
import { Button } from '@/components/ui/button'

export default function StudioLeads({ type }) {
  const inquiries = type === 'inquiries'
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    setLoading(true)
    const request = USE_MOCK ? Promise.resolve({ data: inquiries ? studioInquiriesMock : studioSubscribersMock, meta: { last_page: 1 } }) : http.get(`/studio/${type}`, { params: { page, per_page: 25 } }).then((r) => r.data)
    request.then((result) => { if (active) { setItems(result.data); setLastPage(result.meta.last_page); setError('') } }).catch((e) => { if (active) setError(e.message || 'Unable to load records.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [page, type])
  return <>
    <PageHeader title={inquiries ? 'Studio Inquiries' : 'Studio Subscribers'} description={inquiries ? 'Consultation requests from the Game Studio website.' : 'Newsletter subscriptions from the Game Studio website.'} />
    {error && <p role="alert" className="text-destructive">{error}</p>}
    {loading ? <p>Loading…</p> : !items.length ? <p className="rounded-xl border bg-card p-6 text-muted-foreground">No {inquiries ? 'inquiries' : 'subscribers'} yet.</p> : <ul className="space-y-4">{items.map((item) => <li key={item.id} className="space-y-2 rounded-xl border bg-card p-6">
      <h2 className="font-semibold">{inquiries ? item.full_name : item.email}</h2>
      {inquiries && <><p className="text-sm"><a className="text-brand underline" href={`mailto:${item.email}`}>{item.email}</a>{item.phone && ` · ${item.phone}`}</p>{item.subject && <p className="text-sm font-medium">{item.subject}</p>}<p className="whitespace-pre-wrap text-sm">{item.message}</p>{(item.budget || item.game_type) && <p className="text-sm text-muted-foreground">{[item.game_type, item.budget].filter(Boolean).join(' · ')}</p>}</>}
      <p className="text-sm text-muted-foreground">{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>
    </li>)}</ul>}
    <div className="mt-4 flex items-center gap-3"><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {lastPage}</span><Button variant="outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>Next</Button></div>
  </>
}
