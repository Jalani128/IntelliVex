import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createResource } from '@/services/admin/createResource'
import PageHeader from '@/components/admin/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { studioNewsMock } from '@/mock/admin/studio.mock'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'

const newsApi = createResource('studio/news', { seed: studioNewsMock, imageFields: ['image'] })
const emptyArticle = { title: '', slug: '', excerpt: '', bodyText: '', published_at: '', status: 'draft', image_position: 'center' }
const field = 'w-full rounded-md border bg-background px-3 py-2 text-sm'

export default function StudioNews() {
  const [articles, setArticles] = useState([])
  const [form, setForm] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const load = async () => {
    setLoading(true)
    try { const result = await newsApi.list({ per_page: 100 }); setArticles(result.data); setError('') }
    catch (e) { setError(e.message || 'Unable to load news.') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  const set = (key, value) => setForm((old) => ({ ...old, [key]: value }))
  const save = async (event) => {
    event.preventDefault(); setSaving(true)
    try {
      const payload = {
        title: form.title.trim(), slug: form.slug.trim() || form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        excerpt: form.excerpt, body: form.bodyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        published_at: form.published_at || null, status: form.status, image_position: form.image_position || 'center',
      }
      const result = form.id ? await newsApi.update(form.id, payload) : await newsApi.create(payload)
      if (form.image) {
        try { await newsApi.update(result.data.id, { image: form.image }) }
        catch { toast.error('Article saved, but the image upload failed. Edit it to retry.'); setForm(null); await load(); return }
      }
      setForm(null); toast.success('Article saved'); await load()
    } catch (e) { toast.error(e.message || 'Unable to save article.') }
    finally { setSaving(false) }
  }
  const remove = async () => { const item = deleting
    try { await newsApi.remove(item.id); toast.success('Article deleted'); await load() }
    catch (e) { toast.error(e.message || 'Unable to delete article.') }
  }
  return <>
    <PageHeader title="Studio News" description="Manage articles shown on the Game Studio website." actions={<Button onClick={() => setForm({ ...emptyArticle })}>Add article</Button>} />
    {error && <p role="alert" className="mt-4 text-destructive">{error}</p>}
    {form && <form onSubmit={save} className="mt-6 space-y-4 rounded-xl border bg-card p-6">
      <h2 className="text-xl font-semibold">{form.id ? 'Edit article' : 'New article'}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm"><span>Title</span><Input required maxLength={150} value={form.title} onChange={(e) => set('title', e.target.value)} /></label>
        <label className="space-y-1 text-sm"><span>Slug (optional)</span><Input maxLength={180} value={form.slug} onChange={(e) => set('slug', e.target.value)} /></label>
        <label className="space-y-1 text-sm"><span>Publication date</span><Input type="date" required={form.status === 'published'} value={form.published_at || ''} onChange={(e) => set('published_at', e.target.value)} /></label>
        <label className="space-y-1 text-sm"><span>Status</span><select className={field} value={form.status} onChange={(e) => set('status', e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        <label className="space-y-1 text-sm"><span>Article image</span><Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => set('image', e.target.files[0])} /></label>
      </div>
      {form.image_url && <img src={form.image_url} alt="Current article artwork" className="h-32 rounded object-cover" />}
      <label className="block space-y-1 text-sm"><span>Excerpt</span><textarea className={field} rows={3} maxLength={1000} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></label>
      <label className="block space-y-1 text-sm"><span>Article text (separate paragraphs with a blank line)</span><textarea className={field} rows={10} value={form.bodyText} onChange={(e) => set('bodyText', e.target.value)} /></label>
      <div className="flex gap-3"><Button disabled={saving}>{saving ? 'Saving…' : 'Save article'}</Button><Button type="button" variant="outline" onClick={() => setForm(null)}>Cancel</Button></div>
    </form>}
    <div className="mt-6 overflow-x-auto rounded-xl border bg-card"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-4">Article</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{articles.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="p-4">{item.title}</td><td className="p-4">{item.published_at || '—'}</td><td className="p-4 capitalize">{item.status}</td><td className="p-4"><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setForm({ ...emptyArticle, ...item, published_at: item.published_at?.slice(0,10) || '', bodyText: (item.body || []).join('\n\n') })}>Edit</Button><Button size="sm" variant="outline" onClick={() => setDeleting(item)}>Delete</Button></div></td></tr>)}</tbody></table>{loading ? <p className="p-4">Loading articles…</p> : !articles.length && <p className="p-4 text-muted-foreground">No articles yet.</p>}</div>
    <ConfirmDeleteDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)} onConfirm={remove} title={`Delete ${deleting?.title ?? ''}?`} />
  </>
}
