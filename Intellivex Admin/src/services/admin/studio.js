import { createResource } from './createResource'
import { http } from './http'
import { USE_MOCK } from './config'
import { mediaUrl } from './media'
import { delay, queryRecords } from './mockAdapter'
import {
  studioApplicationsMock,
  studioGamesMock,
  studioInquiriesMock,
  studioJobsMock,
  studioMembersMock,
  studioNewsMock,
  studioPartnersMock,
  studioReviewsMock,
  studioSubscribersMock,
} from '@/mock/admin/studio.mock'

/**
 * Game Studio website (Laravel `/api/admin/studio/...`).
 * Images can be replaced but not removed: the API ignores an empty `image`.
 */
export const STUDIO_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

const records = (endpoint, seed) => createResource(endpoint, { seed, searchFields: ['title', 'name'], imageFields: ['image'] })

export const studioGamesApi = records('studio/games', studioGamesMock)
export const studioNewsApi = records('studio/news', studioNewsMock)
export const studioJobsApi = createResource('studio/jobs', { seed: studioJobsMock, searchFields: ['title'] })
export const studioMembersApi = records('studio/people/members', studioMembersMock)
export const studioReviewsApi = records('studio/people/reviews', studioReviewsMock)
export const studioPartnersApi = records('studio/people/partners', studioPartnersMock)

/** Read-only lists of what visitors sent in (newest first). */
const inbox = (endpoint, seed) => ({
  list: (params) =>
    USE_MOCK ? delay(queryRecords(seed, params, { searchFields: [] })) : http.get(`/${endpoint}`, { params }).then((r) => r.data),
})

export const studioInquiriesApi = inbox('studio/inquiries', studioInquiriesMock)
export const studioSubscribersApi = inbox('studio/subscribers', studioSubscribersMock)
export const studioApplicationsApi = {
  ...inbox('studio/applications', studioApplicationsMock),
  /** Saves the applicant's CV through the browser (the file is only served to signed-in admins). */
  async downloadCv(application) {
    if (USE_MOCK) throw new Error('CV download needs the real API.')
    const response = await http.get(`/studio/applications/${application.id}/cv`, { responseType: 'blob' })
    const url = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url
    link.download = `application-${application.id}.${application.cv_extension}`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  },
}

/**
 * Single-row page content: `{ content: { key: text }, images: { slot: url } }`.
 * Text saves with PUT; each image uploads on its own as soon as it's picked.
 * Our Studio and Contact have one image, exposed here as slot `image`.
 */
function studioPage(endpoint, uploadPath) {
  if (USE_MOCK) {
    let page = { content: {}, images: {} }
    return {
      get: () => delay(page),
      save: (content) => delay((page = { ...page, content })),
      upload: (slot, file) => delay((page = { ...page, images: { ...page.images, [slot]: URL.createObjectURL(file) } })),
    }
  }
  const toPage = (data) => ({
    content: data.content ?? {},
    images: data.images
      ? Object.fromEntries(Object.entries(data.images).map(([slot, url]) => [slot, mediaUrl(url)]))
      : { image: mediaUrl(data.image_url) },
  })
  return {
    get: () => http.get(`/${endpoint}`).then((r) => toPage(r.data.data)),
    save: (content) => http.put(`/${endpoint}`, { content }).then((r) => toPage(r.data.data)),
    upload: (slot, file) => {
      const data = new FormData()
      data.append('image', file)
      return http
        .post(`/${uploadPath(slot)}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => toPage(r.data.data))
    },
  }
}

export const studioHomeApi = studioPage('studio/home', (slot) => `studio/home/images/${slot}`)
export const studioProfileApi = studioPage('studio/profile', () => 'studio/profile/image')
export const studioContactApi = studioPage('studio/contact-page', () => 'studio/contact-page/image')
