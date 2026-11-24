import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { http } from '@/services/admin/http'
import { USE_MOCK } from '@/services/admin/config'
import { mediaUrl } from '@/services/admin/media'
import PageHeader from '@/components/admin/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const fields = [
  ['address_0','Address line 1','AZ1025, BAKI ŞƏHƏRİ XƏTAİ RAYONU,'], ['address_1','Address line 2','8 NOYABR, ev.15, AZURE BUSİNESS CENTER, m. 165B'],
  ['email','Email','info@intellivexstudios.com'], ['phone_0','Phone 1','+994 10 243 9644'], ['phone_1','Phone 2','+994 10 243 9645'],
  ['map_url','Map link','https://www.google.com/maps/search/?api=1&query=Azure+Business+Center+Baku'],
]
const defaults = Object.fromEntries(fields.map(([key,,value]) => [key,value]))
let mockPage = { content: {}, image_url: null }
const api = {
  get: async () => USE_MOCK ? structuredClone(mockPage) : (await http.get('/studio/contact-page')).data.data,
  save: async (content) => { if (USE_MOCK) { mockPage.content = structuredClone(content); return mockPage }; return (await http.put('/studio/contact-page', { content })).data.data },
  upload: async (file) => { if (USE_MOCK) { mockPage.image_url = URL.createObjectURL(file); return mockPage }; const data = new FormData(); data.append('image', file); return (await http.post('/studio/contact-page/image', data, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data },
}

export default function StudioContact() {
  const [content, setContent] = useState(defaults)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')
  useEffect(() => {
    let active = true
    api.get().then((data) => { if (active) { setContent({ ...defaults, ...data.content }); setImage(mediaUrl(data.image_url)) } }).catch((e) => { if (active) setError(e.message || 'Unable to load contact content.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const save = async (event) => {
    event.preventDefault(); setBusy('save')
    try { await api.save(content); toast.success('Contact page saved') }
    catch (e) { toast.error(e.message || 'Unable to save contact page.') }
    finally { setBusy('') }
  }
  const upload = async (file) => {
    if (!file) return
    setBusy('image')
    try { const result = await api.upload(file); setImage(mediaUrl(result.image_url)); toast.success('Map image saved') }
    catch (e) { toast.error(e.message || 'Unable to upload image.') }
    finally { setBusy('') }
  }
  if (loading) return <p>Loading contact page…</p>
  return <>
    <PageHeader title="Studio Contact Page" description="Edit Game Studio contact details and map." />
    {error ? <p role="alert" className="text-destructive">{error}</p> : <>
      <form onSubmit={save} className="space-y-5 rounded-xl border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">{fields.map(([key,label]) => <label key={key} className="space-y-1 text-sm"><span>{label}</span><Input type={key === 'email' ? 'email' : key === 'map_url' ? 'url' : 'text'} required={key === 'email' || key === 'map_url'} maxLength={key === 'map_url' ? 2048 : 255} value={content[key] ?? ''} onChange={(e) => setContent((old) => ({ ...old, [key]: e.target.value }))} /></label>)}</div>
        <Button disabled={!!busy}>{busy === 'save' ? 'Saving…' : 'Save contact page'}</Button>
      </form>
      <section className="mt-6 rounded-xl border bg-card p-6"><h2 className="text-lg font-semibold">Map image</h2><p className="mt-1 text-sm text-muted-foreground">JPEG, PNG or WebP, up to 5 MB. Saved when selected.</p>{image && <img src={image} alt="Current map" className="mt-4 h-32 max-w-full rounded object-contain" />}<label className="mt-4 block max-w-md space-y-1 text-sm"><span>Upload map image</span><Input type="file" accept="image/jpeg,image/png,image/webp" disabled={!!busy} onChange={(e) => { upload(e.target.files[0]); e.target.value = '' }} /></label></section>
    </>}
  </>
}
