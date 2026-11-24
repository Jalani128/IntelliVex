import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createResource } from '@/services/admin/createResource'
import PageHeader from '@/components/admin/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { studioJobsMock } from '@/mock/admin/studio.mock'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'

const jobsApi = createResource('studio/jobs', { seed: studioJobsMock })
const emptyJob = { title: '', slug: '', category: '', summary: '', description: '', requirements: '', why_join: '', perksText: '', salary: '', employment_type: '', location: '', experience: '', work_mode: '', posted_at: '', status: 'draft' }
const inputClass = 'w-full rounded-md border bg-background px-3 py-2 text-sm'

export default function StudioJobs() {
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const load = async (pageNumber = page) => {
    setLoading(true)
    try { const result = await jobsApi.list({ per_page: 25, page: pageNumber }); setJobs(result.data); setLastPage(result.meta?.last_page || 1); setError('') }
    catch (e) { setError(e.message || 'Unable to load roles.') }
    finally { setLoading(false) }
  }
  useEffect(() => { load(page) }, [page])
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const save = async (event) => {
    event.preventDefault(); setSaving(true)
    try {
      const payload = Object.fromEntries(['title','slug','category','summary','description','requirements','why_join','salary','employment_type','location','experience','work_mode','posted_at','status'].map((key) => [key, form[key] || null]))
      payload.slug = form.slug.trim() || form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      payload.perks = form.perksText.split('\n').map((item) => item.trim()).filter(Boolean)
      if (form.id) await jobsApi.update(form.id, payload)
      else await jobsApi.create(payload)
      setForm(null); toast.success('Role saved'); await load()
    } catch (e) { toast.error(e.message || 'Unable to save role.') }
    finally { setSaving(false) }
  }
  const remove = async () => { const job = deleting
    try { await jobsApi.remove(job.id); toast.success('Role deleted'); await load() }
    catch (e) { toast.error(e.message || 'Unable to delete role.') }
  }
  return <>
    <PageHeader title="Studio Careers" description="Manage open roles on the Game Studio website." actions={<Button onClick={() => setForm({ ...emptyJob })}>Add role</Button>} />
    {error && <p role="alert" className="text-destructive">{error}</p>}
    {form && <form onSubmit={save} className="mt-6 space-y-4 rounded-xl border bg-card p-6">
      <h2 className="text-xl font-semibold">{form.id ? 'Edit role' : 'New role'}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {[["title","Title"],["slug","Slug (optional)"],["category","Category"],["salary","Salary"],["employment_type","Employment type"],["location","Location"],["experience","Experience"],["work_mode","Work mode"]].map(([key,label]) => <label key={key} className="space-y-1 text-sm"><span>{label}</span><Input required={key === 'title' || key === 'category'} value={form[key] || ''} onChange={(e) => set(key, e.target.value)} /></label>)}
        <label className="space-y-1 text-sm"><span>Posted date</span><Input type="date" value={form.posted_at || ''} onChange={(e) => set('posted_at',e.target.value)} /></label>
        <label className="space-y-1 text-sm"><span>Status</span><select className={inputClass} value={form.status} onChange={(e) => set('status',e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></label>
      </div>
      {[["summary","Summary"],["description","Description"],["requirements","Requirements"],["why_join","Why join"],["perksText","Benefits (one per line)"]].map(([key,label]) => <label key={key} className="block space-y-1 text-sm"><span>{label}</span><textarea className={inputClass} rows={3} value={form[key] || ''} onChange={(e) => set(key,e.target.value)} /></label>)}
      <div className="flex gap-3"><Button disabled={saving}>{saving ? 'Saving…' : 'Save role'}</Button><Button type="button" variant="outline" onClick={() => setForm(null)}>Cancel</Button></div>
    </form>}
    <div className="mt-6 overflow-x-auto rounded-xl border bg-card"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{jobs.map((job) => <tr key={job.id} className="border-b last:border-0"><td className="p-4">{job.title}</td><td className="p-4 capitalize">{job.status}</td><td className="p-4"><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setForm({ ...emptyJob, ...job, posted_at: job.posted_at?.slice(0,10) || '', perksText: (job.perks || []).join('\n') })}>Edit</Button><Button size="sm" variant="outline" onClick={() => setDeleting(job)}>Delete</Button></div></td></tr>)}</tbody></table>{loading ? <p className="p-4">Loading roles…</p> : !jobs.length && <p className="p-4 text-muted-foreground">No roles yet.</p>}</div>
    <div className="mt-4 flex items-center gap-3"><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {lastPage}</span><Button variant="outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>Next</Button></div>
    <ConfirmDeleteDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)} onConfirm={remove} title={`Delete ${deleting?.title ?? ''}?`} description="Existing applications will be kept." />
  </>
}
