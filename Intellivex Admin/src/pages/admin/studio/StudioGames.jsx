import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { createResource } from '@/services/admin/createResource'
import PageHeader from '@/components/admin/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { studioGamesMock } from '@/mock/admin/studio.mock'
import ConfirmDeleteDialog from '@/components/admin/modals/ConfirmDeleteDialog'

const gamesApi = createResource('studio/games', { seed: studioGamesMock, imageFields: ['image'] })
const emptyGame = { title: '', slug: '', genre: '', description: '', features_intro: '', features: [], platforms: [], categories: [], downloads: '', rating: '', reviews: '', download_url: '', status: 'draft', sort_order: 0 }
const categories = ['mobile', 'web', 'pc', 'console', 'cloud', 'immersive']
const platforms = ['mobile', 'pc', 'console']
const field = 'w-full rounded-md border bg-background px-3 py-2 text-sm'

export default function StudioGames() {
  const [games, setGames] = useState([])
  const [form, setForm] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const load = async () => {
    setLoading(true)
    try { const result = await gamesApi.list({ per_page: 100 }); setGames(result.data); setError('') }
    catch (e) { setError(e.message || 'Unable to load games.') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  const set = (name, value) => setForm((current) => ({ ...current, [name]: value }))
  const toggle = (name, value) => set(name, form[name].includes(value) ? form[name].filter((v) => v !== value) : [...form[name], value])
  const save = async (event) => {
    event.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, slug: form.slug.trim() || form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), sort_order: Number(form.sort_order) }
      delete payload.id; delete payload.image_url; delete payload.created_at; delete payload.updated_at
      const image = payload.image
      delete payload.image
      payload.features = payload.features.map((v) => v.trim()).filter(Boolean)
      const result = form.id ? await gamesApi.update(form.id, payload) : await gamesApi.create(payload)
      if (image) {
        try { await gamesApi.update(result.data.id, { image }) }
        catch (uploadError) { toast.error('Game saved, but the image could not be uploaded. Edit the game to retry.'); setForm(null); await load(); return }
      }
      setForm(null); toast.success('Game saved'); await load()
    } catch (e) { toast.error(e.message || 'Unable to save game.') }
    finally { setSaving(false) }
  }
  const remove = async () => { const game = deleting
    try { await gamesApi.remove(game.id); toast.success('Game deleted'); await load() }
    catch (e) { toast.error(e.message || 'Unable to delete game.') }
  }
  return <>
    <PageHeader title="Studio Games" description="Manage games shown on the Game Studio website." actions={<Button onClick={() => setForm({ ...emptyGame })}>Add game</Button>} />
    <Link to="/admin" className="text-sm text-brand underline">Back to website dashboard</Link>
    {error && <p role="alert" className="mt-4 text-destructive">{error}</p>}
    {form && <form onSubmit={save} className="mt-6 space-y-4 rounded-xl border bg-card p-6">
      <h2 className="text-xl font-semibold">{form.id ? 'Edit game' : 'New game'}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {[['title','Title'],['slug','Slug (optional)'],['genre','Genre'],['downloads','Downloads'],['rating','Rating'],['reviews','Reviews'],['download_url','Download URL'],['sort_order','Sort order']].map(([name,label]) => <label key={name} className="space-y-1 text-sm"><span>{label}</span><Input required={name === 'title'} type={name === 'sort_order' ? 'number' : name === 'download_url' ? 'url' : 'text'} min={name === 'sort_order' ? 0 : undefined} value={form[name] ?? ''} onChange={(e) => set(name,e.target.value)} /></label>)}
        <label className="space-y-1 text-sm"><span>Status</span><select className={field} value={form.status} onChange={(e) => set('status',e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        <label className="space-y-1 text-sm"><span>Game image</span><Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => set('image',e.target.files[0])} /></label>
      </div>
      {form.image_url && <img src={form.image_url} alt="Current game artwork" className="h-32 rounded object-cover" />}
      {[['description','Description'],['features_intro','Features introduction']].map(([name,label]) => <label key={name} className="block space-y-1 text-sm"><span>{label}</span><textarea className={field} rows={3} value={form[name] ?? ''} onChange={(e) => set(name,e.target.value)} /></label>)}
      <label className="block space-y-1 text-sm"><span>Features (one per line)</span><textarea className={field} rows={3} value={(form.features ?? []).join('\n')} onChange={(e) => set('features',e.target.value.split('\n'))} /></label>
      {[["platforms",platforms],["categories",categories]].map(([name,items]) => <fieldset key={name} className="flex flex-wrap gap-4 text-sm"><legend className="mb-2 font-medium capitalize">{name}</legend>{items.map((item) => <label key={item} className="flex items-center gap-2 capitalize"><input type="checkbox" checked={(form[name] ?? []).includes(item)} onChange={() => toggle(name,item)} />{item}</label>)}</fieldset>)}
      <div className="flex gap-3"><Button disabled={saving}>{saving ? 'Saving…' : 'Save game'}</Button><Button type="button" variant="outline" onClick={() => setForm(null)}>Cancel</Button></div>
    </form>}
    <div className="mt-6 overflow-x-auto rounded-xl border bg-card"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-4">Game</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{games.map((game) => <tr key={game.id} className="border-b last:border-0"><td className="p-4">{game.title}</td><td className="p-4 capitalize">{game.status}</td><td className="p-4"><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setForm({ ...emptyGame, ...game, features: game.features ?? [], platforms: game.platforms ?? [], categories: game.categories ?? [] })}>Edit</Button><Button size="sm" variant="outline" onClick={() => setDeleting(game)}>Delete</Button></div></td></tr>)}</tbody></table>{loading ? <p className="p-4">Loading games…</p> : !games.length && <p className="p-4 text-muted-foreground">No games yet.</p>}</div>
    <ConfirmDeleteDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)} onConfirm={remove} title={`Delete ${deleting?.title ?? ''}?`} />
  </>
}
