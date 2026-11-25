import { CONTACT } from '../data/contact'
import defaultMap from '../assets/contact/map.jpg'
import { media, useStudioApi } from '../lib/studioApi'

export function useStudioContact() {
  const { status, data } = useStudioApi('/studio/contact-page')
  const page = status === 'ok' && data ? data : { content: {}, image_url: null }
  const text = (key, fallback) => Object.prototype.hasOwnProperty.call(page.content || {}, key) ? (page.content[key] ?? '') : fallback
  return {
    loading: status === 'loading',
    email: text('email', CONTACT.email), phones: [text('phone_0', CONTACT.phones[0]), text('phone_1', CONTACT.phones[1])].filter(Boolean),
    address: [text('address_0', CONTACT.address[0]), text('address_1', CONTACT.address[1])].filter(Boolean),
    mapUrl: text('map_url', CONTACT.mapUrl), image: media(page.image_url, defaultMap),
    heading: text('heading', 'Contact us'), visitHeading: text('visit_heading', 'Visit us'), contactHeading: text('contact_heading', 'Contact'),
    consultationHeading: text('consultation_heading', 'Get Free Consultation'), consultationButton: text('consultation_button', 'Get Consultation'),
    subscribeButton: text('subscribe_button', 'Subscribe'),
    pageTitle: text('page_title', 'Contact'),
    labels: { name: text('name_label', 'Full Name'), phone: text('phone_label', 'Phone'), email: text('email_label', 'Email'), subject: text('subject_label', 'Subject'), budget: text('budget_label', 'Budget'), gameType: text('game_type_label', 'Type of game'), message: text('message_label', 'Write Message'), newsletter: text('newsletter_label', 'Email') },
  }
}
