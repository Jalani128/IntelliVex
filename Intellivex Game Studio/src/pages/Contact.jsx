import { useState } from 'react'
import CtaBanner from '../components/CtaBanner'
import PageBanner from '../components/PageBanner'
import Partners from '../components/Partners'
import { BUDGETS, GAME_CATEGORIES } from '../data/contact'
import { STUDIO_API } from '../hooks/useStudioCareers'
import { useStudioContact } from '../hooks/useStudioContact'
import chevron from '../assets/careers/chevron-down.svg'

const FIELD = 'block w-full rounded-[16px] border border-cyan bg-ink/40 px-7 font-display text-[16px] text-white placeholder:text-white transition-shadow duration-300 focus:shadow-[0_0_0_3px_rgba(7,249,251,0.25)] focus:outline-none aria-[invalid=true]:border-[#ff6b6b]'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = { full_name: '', phone: '', email: '', subject: '', budget: '', game_type: '', message: '' }

function validate(v) {
  const e = {}
  if (!v.full_name.trim()) e.full_name = 'Please enter your name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email.'
  if (v.phone.trim() && !/^[0-9+\-().\s]{7,30}$/.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.'
  if (v.message.trim().length < 10) e.message = 'Please write at least 10 characters.'
  return e
}

function Field({ name, label, error, as = 'input', children, ...props }) {
  const Tag = as
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <Tag
        name={name}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${FIELD} ${as === 'textarea' ? 'h-[173px] resize-none py-4' : 'h-[52px]'} ${as === 'select' ? 'appearance-none pr-12 [&>option]:bg-ink' : ''}`}
        {...props}
      >
        {children}
      </Tag>
      {as === 'select' && <img src={chevron} alt="" aria-hidden className="pointer-events-none absolute top-[26px] right-6 h-2 w-4 -translate-y-1/2 rotate-180" />}
      {error && <span id={`${name}-error`} className="mt-1.5 block px-2 font-lato text-[14px] text-[#ff8a8a]">{error}</span>}
    </label>
  )
}

function ConsultationForm({ contact }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const bind = (name) => ({
    value: values[name],
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: e.target.value }))
      if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
    },
  })

  const submit = async (e) => {
    e.preventDefault()
    setSent(false); setSubmitError('')
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    setSending(true)
    try {
      const response = await fetch(`${STUDIO_API}/studio/inquiries`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (data.errors) setErrors(Object.fromEntries(Object.entries(data.errors).map(([key, messages]) => [key, messages[0]])))
        throw new Error(data.message || 'Unable to send your inquiry. Please try again.')
      }
      setValues(EMPTY); setSent(true)
    } catch (error) { setSubmitError(error.message || 'Unable to send your inquiry. Please try again.') }
    finally { setSending(false) }
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby="consult-title" className="glass-card glass-card-cyan mx-auto mt-16 max-w-[1061px] px-5 pt-10 pb-10 sm:px-[47px] sm:pt-[47px] sm:pb-14 lg:mt-[97px]">
      <h2 id="consult-title" className="text-center font-display text-[26px] leading-[1.42] font-semibold sm:text-[32px]">{contact.consultationHeading}</h2>
      <div className="mt-8 grid gap-x-16 gap-y-[26px] md:grid-cols-2">
        <Field name="full_name" label={contact.labels.name} placeholder={contact.labels.name} autoComplete="name" error={errors.full_name} {...bind('full_name')} />
        <Field name="phone" label={contact.labels.phone} placeholder={contact.labels.phone} type="tel" autoComplete="tel" error={errors.phone} {...bind('phone')} />
        <Field name="email" label={contact.labels.email} placeholder={contact.labels.email} type="email" autoComplete="email" error={errors.email} {...bind('email')} />
        <Field name="subject" label={contact.labels.subject} placeholder={contact.labels.subject} error={errors.subject} {...bind('subject')} />
        <Field name="budget" label={contact.labels.budget} as="select" error={errors.budget} {...bind('budget')}>
          <option value="">{contact.labels.budget}</option>
          {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
        </Field>
        <Field name="game_type" label={contact.labels.gameType} as="select" error={errors.game_type} {...bind('game_type')}>
          <option value="">{contact.labels.gameType}</option>
          {GAME_CATEGORIES.map((c) => <option key={c.key} value={c.label}>{c.label}</option>)}
        </Field>
        <div className="md:col-span-2">
          <Field name="message" label={contact.labels.message} as="textarea" placeholder={contact.labels.message} error={errors.message} {...bind('message')} />
        </div>
      </div>
      <button
        type="submit"
        disabled={sending}
        className="mt-[27px] h-[59px] w-full rounded-[24px] bg-blue font-display text-[20px] font-bold shadow-[0_0_0_3.3px_rgba(255,255,255,0.1),inset_0_-3.3px_1.7px_rgba(0,0,0,0.25),inset_0_1.7px_0.8px_rgba(255,255,255,0.25)] transition-[filter] duration-300 hover:brightness-110 disabled:opacity-50 sm:text-[24px]"
      >
        {sending ? 'Sending…' : contact.consultationButton}
      </button>
      <p role="status" className="mt-4 text-center font-lato text-[16px] text-cyan empty:hidden">
        {sent ? 'Your inquiry has been submitted successfully.' : ''}
      </p>
      {submitError && <p role="alert" className="mt-4 text-center font-lato text-[#ff8a8a]">{submitError}</p>}
    </form>
  )
}

function Subscribe({ contact }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    setSuccess('')
    if (!EMAIL_RE.test(email.trim())) return setError('Please enter a valid email.')
    setError(''); setSending(true)
    try {
      const response = await fetch(`${STUDIO_API}/studio/subscribe`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim() }) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to subscribe. Please try again.')
      setEmail(''); setSuccess('Thank you for subscribing.')
    } catch (failure) { setError(failure.message || 'Unable to subscribe. Please try again.') }
    finally { setSending(false) }
  }
  return (
    <form onSubmit={submit} noValidate className="mt-14 w-full max-w-[421px]">
      <label className="relative flex h-12 items-center rounded-[31px] border border-cyan bg-ink/40 pr-1 pl-[25px] backdrop-blur-[10px] focus-within:shadow-[0_0_0_3px_rgba(7,249,251,0.25)]">
        <span className="sr-only">Email for newsletter</span>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess('') }}
          placeholder={contact.labels.newsletter}
          autoComplete="email"
          aria-invalid={error ? 'true' : undefined}
          className="min-w-0 flex-1 bg-transparent font-display text-[16px] text-white placeholder:text-white focus:outline-none"
        />
        <button type="submit" disabled={sending} className="h-[37px] w-[110px] shrink-0 rounded-[19px] bg-blue font-display text-[12px] font-bold shadow-[inset_0_-2.5px_1.3px_rgba(0,0,0,0.25),inset_0_1.3px_0.6px_rgba(255,255,255,0.25)] transition-[filter] duration-300 hover:brightness-110 disabled:opacity-50">
          {sending ? 'Sending…' : contact.subscribeButton}
        </button>
      </label>
      {error && <p className="mt-1.5 px-4 font-lato text-[14px] text-[#ff8a8a]">{error}</p>}
      {success && <p role="status" className="mt-1.5 px-4 font-lato text-[14px] text-cyan">{success}</p>}
    </form>
  )
}

export default function Contact() {
  const contact = useStudioContact()
  return (
    <>
      <PageBanner title={contact.pageTitle} trail={[{ label: contact.pageTitle }]} />

      <section className="container-studio pt-[59px] pb-24 lg:pb-[97px]">
        <div className="mx-auto grid max-w-[1061px] grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,550px)_421px] lg:justify-between">
          <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[6px] rounded-tr-[14px] border border-[#4458a6] transition-[border-color] duration-300 hover:border-cyan">
            <img src={contact.image} alt="Studio location map (opens in a new tab)" className="aspect-[550/400] w-full object-cover object-[64%_center]" />
          </a>

          <div>
            <h2 className="font-display text-[30px] font-semibold sm:text-[36px]">{contact.heading}</h2>
            <div className="mt-14 flex flex-wrap justify-between gap-8">
              <div className="w-[191px]">
                <h3 className="font-display text-[24px] font-bold text-cyan">{contact.visitHeading}</h3>
                <address className="mt-4 font-display text-[16px] leading-[1.42] not-italic">
                  {contact.address.map((line, i) => <span key={i} className="block">{line}</span>)}
                </address>
              </div>
              <div>
                <h3 className="font-display text-[24px] font-bold text-cyan">{contact.contactHeading}</h3>
                <ul className="mt-4 space-y-2 font-lato text-[16px] leading-[1.18]">
                  <li><a href={`mailto:${contact.email}`} className="break-all hover:text-cyan">{contact.email}</a></li>
                  <li>
                    {contact.phones.map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block hover:text-cyan">{p}</a>
                    ))}
                  </li>
                </ul>
              </div>
            </div>
            <Subscribe contact={contact} />
          </div>
        </div>

        <ConsultationForm contact={contact} />
      </section>

      <Partners />
      <CtaBanner />
    </>
  )
}
