import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createResource } from '@/services/admin/createResource'
import { studioMembersMock, studioPartnersMock, studioReviewsMock } from '@/mock/admin/studio.mock'
import PageHeader from '@/components/admin/layout/PageHeader'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Team, testimonials and partners share one API controller (studio/people/{kind}).
const TYPES = {
  members: { api: createResource('studio/people/members', { seed: studioMembersMock, imageFields: ['image'] }), label: 'Team member', title: 'Studio Team', image: 'Photo' },
  reviews: { api: createResource('studio/people/reviews', { seed: studioReviewsMock, imageFields: ['image'] }), label: 'Testimonial', title: 'Studio Testimonials', image: 'Photo' },
  partners: { api: createResource('studio/people/partners', { seed: studioPartnersMock, imageFields: ['image'] }), label: 'Partner', title: 'Studio Partners', image: 'Logo' },
}
const empty = { name: '', role: '', quote: '', status: 'draft', sort_order: 0 }
const inputClass = 'w-full rounded-md border bg-background px-3 py-2 text-sm'

export default function StudioPeople({ type }) {
  const { api, label, title, image } = TYPES[type]
  const isReview = type === 'reviews'
  const isPartner = type === 'partners'
  const [records, setRecords] = useState([])
  const [form, setForm] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const load = async (number = page) => {
    setLoading(true)
    try { const result = await api.list({ per_page: 25, page: number, sort: 'sort_order' }); setRecords(result.data); setLastPage(result.meta?.last_page || 1); setError('') }
    catch (e) { setError(e.message || `Unable to load ${label.toLowerCase()} records.`) }
    finally { setLoading(false) }
  }
  useEffect(() => { load(page) }, [page, type])
  const set = (key,value) => setForm((old) => ({ ...old, [key]: value }))
  const save = async (event) => {
    event.preventDefault(); setSaving(true)
    try {
      const payload = { name: form.name.trim(), status: form.status, sort_order: Number(form.sort_order) }
      if (!isPartner) payload.role = (form.role || '').trim() || null
      if (isReview) payload.quote = form.quote.trim()
      const result = form.id ? await api.update(form.id,payload) : await api.create(payload)
      if (form.image) {
        try { await api.update(result.data.id, { image: form.image }) }
        catch { toast.error(`${label} saved, but the image upload failed. Edit it to retry.`); setForm(null); await load(); return }
      }
      setForm(null); toast.success(`${label} saved`); await load()
    } catch (e) { toast.error(e.message || `Unable to save ${label.toLowerCase()}.`) }
    finally { setSaving(false) }
  }
  const remove = async () => {
    try { await api.remove(deleting.id); toast.success(`${label} deleted`); await load() }
    catch (e) { toast.error(e.message || 'Unable to delete record.') }
  }
  return <>
    <PageHeader title={title} description={`Manage ${label.toLowerCase()} records shown on the Game Studio website.`} actions={<Button onClick={() => setForm({ ...empty })}>Add {label.toLowerCase()}</Button>} />
    {error && <p role="alert" className="text-destructive">{error}</p>}
    {form && <form onSubmit={save} className="mt-6 space-y-4 rounded-xl border bg-card p-6">
      <h2 className="text-xl font-semibold">{form.id ? 'Edit' : 'New'} {label.toLowerCase()}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm"><span>Name</span><Input required maxLength={150} value={form.name} onChange={(e) => set('name',e.target.value)} /></label>
        {!isPartner && <label className="space-y-1 text-sm"><span>{isReview ? 'Company / role' : 'Role'}</span><Input maxLength={150} value={form.role || ''} onChange={(e) => set('role',e.target.value)} /></label>}
        <label className="space-y-1 text-sm"><span>Status</span><select className={inputClass} value={form.status} onChange={(e) => set('status',e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        <label className="space-y-1 text-sm"><span>Sort order</span><Input type="number" min="0" value={form.sort_order} onChange={(e) => set('sort_order',e.target.value)} /></label>
        <label className="space-y-1 text-sm"><span>{image}</span><Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => set('image',e.target.files[0])} /></label>
      </div>
      {form.image_url && <img src={form.image_url} alt={`Current ${image.toLowerCase()}`} className={isPartner ? 'h-12 rounded object-contain' : 'h-24 rounded object-cover'} />}
      {isReview && <label className="block space-y-1 text-sm"><span>Quote</span><textarea className={inputClass} required maxLength={5000} rows={4} value={form.quote} onChange={(e) => set('quote',e.target.value)} /></label>}
      <div className="flex gap-3"><Button disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button><Button type="button" variant="outline" onClick={() => setForm(null)}>Cancel</Button></div>
    </form>}
    <div className="mt-6 overflow-x-auto rounded-xl border bg-card"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-4">Name</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{records.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="p-4">{item.name}</td><td className="p-4 capitalize">{item.status}</td><td className="p-4"><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setForm({ ...empty, ...item })}>Edit</Button><Button size="sm" variant="outline" onClick={() => setDeleting(item)}>Delete</Button></div></td></tr>)}</tbody></table>{loading ? <p className="p-4">Loading…</p> : !records.length && <p className="p-4 text-muted-foreground">No records yet.</p>}</div>
    <div className="mt-4 flex items-center gap-3"><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {lastPage}</span><Button variant="outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>Next</Button></div>
    <ConfirmDeleteDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)} onConfirm={remove} title={`Delete ${deleting?.name ?? ''}?`} />
  </>
}
