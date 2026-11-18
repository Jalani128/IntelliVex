import { useState } from 'react'
import CtaBanner from '../components/CtaBanner'
import PageBanner from '../components/PageBanner'
import Partners from '../components/Partners'
import { BUDGETS, CONTACT, GAME_CATEGORIES } from '../data/contact'
import map from '../assets/contact/map.jpg'
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

// shortcut: no backend endpoint for studio inquiries yet, so this opens the visitor's mail app; post to the API once the Admin side exists.
function sendByEmail(subject, lines) {
  window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
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

function ConsultationForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const bind = (name) => ({
    value: values[name],
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: e.target.value }))
      if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
    },
  })

  const submit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    sendByEmail(values.subject.trim() || 'Free consultation request', [
      `Name: ${values.full_name.trim()}`,
      `Email: ${values.email.trim()}`,
      `Phone: ${values.phone.trim() || '-'}`,
      `Budget: ${values.budget || '-'}`,
      `Type of game: ${values.game_type || '-'}`,
      '',
      values.message.trim(),
    ])
    setSent(true)
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby="consult-title" className="glass-card glass-card-cyan mx-auto mt-16 max-w-[1061px] px-5 pt-10 pb-10 sm:px-[47px] sm:pt-[47px] sm:pb-14 lg:mt-[97px]">
      <h2 id="consult-title" className="text-center font-display text-[26px] leading-[1.42] font-semibold sm:text-[32px]">Get Free Consultation</h2>
      <div className="mt-8 grid gap-x-16 gap-y-[26px] md:grid-cols-2">
        <Field name="full_name" label="Full Name" placeholder="Full Name" autoComplete="name" error={errors.full_name} {...bind('full_name')} />
        <Field name="phone" label="Phone" placeholder="Phone" type="tel" autoComplete="tel" error={errors.phone} {...bind('phone')} />
        <Field name="email" label="Email" placeholder="Email" type="email" autoComplete="email" error={errors.email} {...bind('email')} />
        <Field name="subject" label="Subject" placeholder="Subject" {...bind('subject')} />
        <Field name="budget" label="Budget" as="select" {...bind('budget')}>
          <option value="">Budget</option>
          {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
        </Field>
        <Field name="game_type" label="Type of game" as="select" {...bind('game_type')}>
          <option value="">Type of game</option>
          {GAME_CATEGORIES.map((c) => <option key={c.key} value={c.label}>{c.label}</option>)}
        </Field>
        <div className="md:col-span-2">
          <Field name="message" label="Write Message" as="textarea" placeholder="Write Message" error={errors.message} {...bind('message')} />
        </div>
      </div>
      <button
        type="submit"
        className="mt-[27px] h-[59px] w-full rounded-[24px] bg-blue font-display text-[20px] font-bold shadow-[0_0_0_3.3px_rgba(255,255,255,0.1),inset_0_-3.3px_1.7px_rgba(0,0,0,0.25),inset_0_1.7px_0.8px_rgba(255,255,255,0.25)] transition-[filter] duration-300 hover:brightness-110 sm:text-[24px]"
      >
        Get Consultation
      </button>
      <p role="status" className="mt-4 text-center font-lato text-[16px] text-cyan empty:hidden">
        {sent ? `Your email app should open with the message ready to send. If it does not, write to us at ${CONTACT.email}.` : ''}
      </p>
    </form>
  )
}

function Subscribe() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) return setError('Please enter a valid email.')
    setError('')
    sendByEmail('Newsletter subscription', [`Please add ${email.trim()} to the IntelliVex Studios newsletter.`])
  }
  return (
    <form onSubmit={submit} noValidate className="mt-14 w-full max-w-[421px]">
      <label className="relative flex h-12 items-center rounded-[31px] border border-cyan bg-ink/40 pr-1 pl-[25px] backdrop-blur-[10px] focus-within:shadow-[0_0_0_3px_rgba(7,249,251,0.25)]">
        <span className="sr-only">Email for newsletter</span>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError('') }}
          placeholder="Email"
          autoComplete="email"
          aria-invalid={error ? 'true' : undefined}
          className="min-w-0 flex-1 bg-transparent font-display text-[16px] text-white placeholder:text-white focus:outline-none"
        />
        <button type="submit" className="h-[37px] w-[110px] shrink-0 rounded-[19px] bg-blue font-display text-[12px] font-bold shadow-[inset_0_-2.5px_1.3px_rgba(0,0,0,0.25),inset_0_1.3px_0.6px_rgba(255,255,255,0.25)] transition-[filter] duration-300 hover:brightness-110">
          Subscribe
        </button>
      </label>
      {error && <p className="mt-1.5 px-4 font-lato text-[14px] text-[#ff8a8a]">{error}</p>}
    </form>
  )
}

export default function Contact() {
  return (
    <>
      <PageBanner title="Contact" trail={[{ label: 'Contact' }]} />

      <section className="container-studio pt-[59px] pb-24 lg:pb-[97px]">
        <div className="mx-auto grid max-w-[1061px] gap-12 lg:grid-cols-[minmax(0,550px)_421px] lg:justify-between">
          <a href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[6px] rounded-tr-[14px] border border-[#4458a6] transition-[border-color] duration-300 hover:border-cyan">
            <img src={map} alt="Map showing Azure Business Center, Baku (opens Google Maps)" className="aspect-[550/400] w-full object-cover object-[64%_center]" />
          </a>

          <div>
            <h2 className="font-display text-[30px] font-semibold sm:text-[36px]">Contact us</h2>
            <div className="mt-14 flex flex-wrap justify-between gap-8">
              <div className="w-[191px]">
                <h3 className="font-display text-[24px] font-bold text-cyan">Visit us</h3>
                <address className="mt-4 font-display text-[16px] leading-[1.42] not-italic">
                  {CONTACT.address.map((line) => <span key={line} className="block">{line}</span>)}
                </address>
              </div>
              <div>
                <h3 className="font-display text-[24px] font-bold text-cyan">Contact</h3>
                <ul className="mt-4 space-y-2 font-lato text-[16px] leading-[1.18]">
                  <li><a href={`mailto:${CONTACT.email}`} className="hover:text-cyan">{CONTACT.email}</a></li>
                  <li>
                    {CONTACT.phones.map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block hover:text-cyan">{p}</a>
                    ))}
                  </li>
                </ul>
              </div>
            </div>
            <Subscribe />
          </div>
        </div>

        <ConsultationForm />
      </section>

      <Partners />
      <CtaBanner />
    </>
  )
}
