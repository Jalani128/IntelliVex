import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { http } from '@/services/admin/http'
import { USE_MOCK } from '@/services/admin/config'
import { mediaUrl } from '@/services/admin/media'
import PageHeader from '@/components/admin/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HOME_DEFAULTS, HOME_FIELDS, HOME_IMAGE_SLOTS } from './home-fields'

let mockHome = { content: {}, images: {} }
const homeApi = {
  get: async () => USE_MOCK ? structuredClone(mockHome) : normalize((await http.get('/studio/home')).data.data),
  save: async (content) => {
    if (USE_MOCK) { mockHome.content = structuredClone(content); return mockHome }
    return (await http.put('/studio/home', { content })).data.data
  },
  upload: async (slot, file) => {
    if (USE_MOCK) { mockHome.images[slot] = URL.createObjectURL(file); return mockHome }
    const data = new FormData(); data.append('image', file)
    return normalize((await http.post(`/studio/home/images/${slot}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data)
  },
}

function normalize(data) {
  return { ...data, images: Object.fromEntries(Object.entries(data.images || {}).map(([key, value]) => [key, mediaUrl(value)])) }
}

export default function StudioHome() {
  const [content, setContent] = useState(HOME_DEFAULTS)
  const [images, setImages] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')
  useEffect(() => {
    let active = true
    homeApi.get().then((data) => { if (active) { setContent({ ...HOME_DEFAULTS, ...data.content }); setImages(data.images || {}) } })
      .catch((e) => { if (active) setError(e.message || 'Unable to load Home content.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const save = async (event) => {
    event.preventDefault(); setBusy('save')
    // Home GET also carries the Our Studio stats; send back only Home's own keys.
    try { await homeApi.save(Object.fromEntries(Object.keys(HOME_DEFAULTS).map((key) => [key, content[key]]))); toast.success('Home content saved') }
    catch (e) { toast.error(e.message || 'Unable to save Home content.') }
    finally { setBusy('') }
  }
  const upload = async (slot, file) => {
    if (!file) return
    setBusy(slot)
    try { const data = await homeApi.upload(slot, file); setImages(data.images || {}); toast.success('Image saved') }
    catch (e) { toast.error(e.message || 'Unable to upload image.') }
    finally { setBusy('') }
  }
  if (loading) return <p>Loading Home content…</p>
  return <>
    <PageHeader title="Game Studio Home" description="Edit the Home page copy and artwork. Games are managed in the Games section." />
    {error ? <p role="alert" className="text-destructive">{error}</p> : <>
      <form onSubmit={save} className="space-y-5">
        {HOME_FIELDS.map((group) => <section key={group.title} className="rounded-xl border bg-card p-6"><h2 className="mb-4 text-lg font-semibold">{group.title}</h2><div className="grid gap-4 sm:grid-cols-2">{group.fields.map(([key,label]) => <label key={key} className="space-y-1 text-sm"><span>{label}</span><Input maxLength={1000} value={content[key] ?? ''} onChange={(e) => setContent((old) => ({ ...old, [key]: e.target.value }))} /></label>)}</div></section>)}
        <Button disabled={!!busy}>{busy === 'save' ? 'Saving…' : 'Save Home content'}</Button>
      </form>
      <section className="mt-6 rounded-xl border bg-card p-6"><h2 className="text-lg font-semibold">Home artwork</h2><p className="mt-1 text-sm text-muted-foreground">Images are saved when selected. JPEG, PNG and WebP, up to 5 MB.</p><div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{HOME_IMAGE_SLOTS.map(([slot,label]) => <label key={slot} className="space-y-2 rounded-lg border p-3 text-sm"><span className="block font-medium">{label}</span>{images[slot] && <img src={images[slot]} alt="" className="h-24 max-w-full rounded object-contain" />}<Input type="file" accept="image/jpeg,image/png,image/webp" disabled={!!busy} onChange={(e) => { upload(slot,e.target.files[0]); e.target.value = '' }} />{busy === slot && <span>Uploading…</span>}</label>)}</div></section>
    </>}
  </>
}
