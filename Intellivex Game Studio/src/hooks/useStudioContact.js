import { useEffect, useState } from 'react'
import { CONTACT } from '../data/contact'
import defaultMap from '../assets/contact/map.jpg'

const API = (import.meta.env.VITE_STUDIO_API_URL || 'https://api.theintellivex.com/intellivex/public/api').replace(/\/$/, '')
const MEDIA = (import.meta.env.VITE_STUDIO_MEDIA_URL || 'https://api.theintellivex.com/intellivex/public/storage').replace(/\/$/, '')

export function useStudioContact() {
  const [page, setPage] = useState({ content: {}, image_url: null })
  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let active = true
    fetch(`${API}/studio/contact-page`, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw new Error('Contact API unavailable'); return response.json() })
      .then((response) => { if (active && response.data) setPage(response.data) })
      .catch(() => {})
      .finally(() => clearTimeout(timeout))
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [])
  const text = (key, fallback) => Object.prototype.hasOwnProperty.call(page.content || {}, key) ? (page.content[key] ?? '') : fallback
  const url = page.image_url
  const at = url?.indexOf('/storage/')
  return {
    email: text('email', CONTACT.email), phones: [text('phone_0', CONTACT.phones[0]), text('phone_1', CONTACT.phones[1])].filter(Boolean),
    address: [text('address_0', CONTACT.address[0]), text('address_1', CONTACT.address[1])].filter(Boolean),
    mapUrl: text('map_url', CONTACT.mapUrl), image: url ? (at >= 0 ? `${MEDIA}/${url.slice(at + 9)}` : url) : defaultMap,
    heading: text('heading', 'Contact us'), visitHeading: text('visit_heading', 'Visit us'), contactHeading: text('contact_heading', 'Contact'),
    consultationHeading: text('consultation_heading', 'Get Free Consultation'), consultationButton: text('consultation_button', 'Get Consultation'),
    subscribeButton: text('subscribe_button', 'Subscribe'),
    pageTitle: text('page_title', 'Contact'),
    labels: { name: text('name_label', 'Full Name'), phone: text('phone_label', 'Phone'), email: text('email_label', 'Email'), subject: text('subject_label', 'Subject'), budget: text('budget_label', 'Budget'), gameType: text('game_type_label', 'Type of game'), message: text('message_label', 'Write Message'), newsletter: text('newsletter_label', 'Email') },
  }
}
