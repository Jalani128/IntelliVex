import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { http } from '@/services/admin/http'
import { USE_MOCK } from '@/services/admin/config'
import { mediaUrl } from '@/services/admin/media'
import PageHeader from '@/components/admin/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const fields = [
  ['about_title_0','About title line 1','We Build Platforms'], ['about_title_1','About title line 2','That Empower Gamers'],
  ['about_text','About description','Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem'],
  ['vision_0_text','Vision description','Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng'],
  ['vision_1_text','Mission description','Lorem ipsum dolor sitamet const adipiscng Duis eletum sollicitudin is yaugue euismods. Lorem ipsum dolor sitamet const adipiscng'],
  // Stats also appear on the Home page.
  ...[['10+','Games in Development'],['50+','Talented Creators'],['06+','Platforms'],['Global','Audience Focused']].flatMap(([value,label],i) => [[`stat_${i}_value`, `Statistic ${i + 1} value`, value],[`stat_${i}_label`, `Statistic ${i + 1} label`, label]]),
]
const defaults = Object.fromEntries(fields.map(([key,,value]) => [key,value]))
let mockPage = { content: {}, image_url: null }
const api = {
  get: async () => USE_MOCK ? structuredClone(mockPage) : (await http.get('/studio/profile')).data.data,
  save: async (content) => { if (USE_MOCK) { mockPage.content = structuredClone(content); return mockPage }; return (await http.put('/studio/profile', { content })).data.data },
  upload: async (file) => { if (USE_MOCK) { mockPage.image_url = URL.createObjectURL(file); return mockPage }; const data = new FormData(); data.append('image', file); return (await http.post('/studio/profile/image', data, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data },
}

export default function StudioProfile() {
  const [content, setContent] = useState(defaults)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')
  useEffect(() => {
    let active = true
    api.get().then((data) => { if (active) { setContent({ ...defaults, ...data.content }); setImage(mediaUrl(data.image_url)) } }).catch((e) => { if (active) setError(e.message || 'Unable to load studio content.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const save = async (event) => {
    event.preventDefault(); setBusy('save')
    try { await api.save(content); toast.success('Studio page saved') }
    catch (e) { toast.error(e.message || 'Unable to save studio page.') }
    finally { setBusy('') }
  }
  const upload = async (file) => {
    if (!file) return
    setBusy('image')
    try { const result = await api.upload(file); setImage(mediaUrl(result.image_url)); toast.success('Image saved') }
    catch (e) { toast.error(e.message || 'Unable to upload image.') }
    finally { setBusy('') }
  }
  if (loading) return <p>Loading studio page…</p>
  return <>
    <PageHeader title="Our Studio Page" description="Edit the studio page copy, statistics and main image." />
    {error ? <p role="alert" className="text-destructive">{error}</p> : <>
      <form onSubmit={save} className="space-y-5 rounded-xl border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">{fields.map(([key,label]) => <label key={key} className="space-y-1 text-sm"><span>{label}</span>{key.endsWith('_text') ? <textarea className="w-full rounded-md border bg-background px-3 py-2 text-sm" rows={4} maxLength={5000} value={content[key] ?? ''} onChange={(e) => setContent((old) => ({ ...old, [key]: e.target.value }))} /> : <Input maxLength={200} value={content[key] ?? ''} onChange={(e) => setContent((old) => ({ ...old, [key]: e.target.value }))} />}</label>)}</div>
        <Button disabled={!!busy}>{busy === 'save' ? 'Saving…' : 'Save studio page'}</Button>
      </form>
      <section className="mt-6 rounded-xl border bg-card p-6"><h2 className="text-lg font-semibold">Main studio image</h2><p className="mt-1 text-sm text-muted-foreground">JPEG, PNG or WebP, up to 5 MB. Saved when selected.</p>{image && <img src={image} alt="Current studio artwork" className="mt-4 h-32 max-w-full rounded object-contain" />}<label className="mt-4 block max-w-md space-y-1 text-sm"><span>Upload image</span><Input type="file" accept="image/jpeg,image/png,image/webp" disabled={!!busy} onChange={(e) => { upload(e.target.files[0]); e.target.value = '' }} /></label></section>
    </>}
  </>
}
