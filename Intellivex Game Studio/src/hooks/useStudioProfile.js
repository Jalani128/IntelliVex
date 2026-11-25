import { ABOUT, STATS, TEAM, TESTIMONIALS, VISION_MISSION } from '../data/studio'
import { media, useStudioApi } from '../lib/studioApi'

const fallback = { content: {}, aboutImage: ABOUT.photo, members: TEAM, reviews: TESTIMONIALS }

export function useStudioProfile() {
  const { status, data } = useStudioApi('/studio/profile')
  const valid = status === 'ok' && data && Array.isArray(data.members) && Array.isArray(data.reviews)
  const profile = valid
    ? { content: data.content || {}, aboutImage: media(data.image_url, ABOUT.photo),
        members: data.members.map((m) => ({ ...m, photo: media(m.image_url) })),
        reviews: data.reviews.map((r) => ({ ...r, avatar: media(r.image_url), rating: 5 })) }
    : fallback
  const text = (key, defaultValue) => profile.content[key] ?? defaultValue
  return {
    about: { eyebrow: text('about_eyebrow', ABOUT.eyebrow), title: [text('about_title_0', ABOUT.title[0]), text('about_title_1', ABOUT.title[1])], text: text('about_text', ABOUT.text), photo: profile.aboutImage },
    visionMission: VISION_MISSION.map((item, i) => ({ title: text(`vision_${i}_title`, item.title), text: text(`vision_${i}_text`, item.text) })),
    stats: STATS.map((item, i) => ({ value: text(`stat_${i}_value`, item.value), label: text(`stat_${i}_label`, item.label) })),
    teamEyebrow: text('team_eyebrow', 'Meet The Crew'), teamTitle: text('team_title', 'Team Members'),
    reviewsEyebrow: text('reviews_eyebrow', 'What people’s say about us'), reviewsTitle: text('reviews_title', 'Testimonials'),
    members: profile.members, reviews: profile.reviews,
    loading: status === 'loading',
  }
}
