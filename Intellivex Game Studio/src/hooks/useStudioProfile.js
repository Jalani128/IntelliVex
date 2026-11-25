import { useEffect, useState } from 'react'
import { ABOUT, STATS, TEAM, TESTIMONIALS, VISION_MISSION } from '../data/studio'

const API = (import.meta.env.VITE_STUDIO_API_URL || 'https://api.theintellivex.com/intellivex/public/api').replace(/\/$/, '')
const MEDIA = (import.meta.env.VITE_STUDIO_MEDIA_URL || 'https://api.theintellivex.com/intellivex/public/storage').replace(/\/$/, '')
const fallback = { content: {}, aboutImage: ABOUT.photo, members: TEAM, reviews: TESTIMONIALS }

function media(url, defaultImage) {
  if (!url) return defaultImage
  const at = url.indexOf('/storage/')
  return at >= 0 ? `${MEDIA}/${url.slice(at + 9)}` : url
}

export function useStudioProfile() {
  const [profile, setProfile] = useState(fallback)
  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let active = true
    fetch(`${API}/studio/profile`, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw new Error('Studio API unavailable'); return response.json() })
      .then(({ data }) => {
        if (!data || !Array.isArray(data.members) || !Array.isArray(data.reviews)) throw new Error('Invalid studio data')
        if (active) setProfile({ content: data.content || {}, aboutImage: media(data.image_url, ABOUT.photo),
          members: data.members.map((m) => ({ ...m, photo: media(m.image_url, null) })),
          reviews: data.reviews.map((r) => ({ ...r, avatar: media(r.image_url, null), rating: 5 })),
        })
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout))
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [])
  const text = (key, defaultValue) => profile.content[key] ?? defaultValue
  return {
    about: { eyebrow: text('about_eyebrow', ABOUT.eyebrow), title: [text('about_title_0', ABOUT.title[0]), text('about_title_1', ABOUT.title[1])], text: text('about_text', ABOUT.text), photo: profile.aboutImage },
    visionMission: VISION_MISSION.map((item, i) => ({ title: text(`vision_${i}_title`, item.title), text: text(`vision_${i}_text`, item.text) })),
    stats: STATS.map((item, i) => ({ value: text(`stat_${i}_value`, item.value), label: text(`stat_${i}_label`, item.label) })),
    teamEyebrow: text('team_eyebrow', 'Meet The Crew'), teamTitle: text('team_title', 'Team Members'),
    reviewsEyebrow: text('reviews_eyebrow', 'What people’s say about us'), reviewsTitle: text('reviews_title', 'Testimonials'),
    members: profile.members, reviews: profile.reviews,
  }
}
