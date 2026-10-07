import { api } from "./api";
import { siteHref, splitHeading } from "./portfolio";

/*
 * Public Team API (TEAM_API.md):
 *   GET /api/team-section   "Our Leadership" heading, VIEW ALL button and up to
 *                           three published + featured members (by sort_order)
 */

export const fetchTeamSection = () => api.get("team-section").then((r) => r.data.data);

/* ---------- API → component props ---------- */

/** TeamCard props. `socials` holds only the profiles the member has. */
export const toTeamMember = (m) => ({
  id: m.id,
  name: m.name,
  role: m.designation,
  image: m.photo_url,
  alt: m.photo_alt || m.name,
  initials: m.initials,
  socials: {
    facebook: m.social_links?.facebook || null,
    instagram: m.social_links?.instagram || null,
    linkedin: m.social_links?.linkedin || null,
  },
});

/** GET /api/team-section → Leadership section props. */
export function toLeadership(data) {
  // The highlight is normally a phrase inside the title; if it isn't, it follows the title.
  const heading = splitHeading(data.title ?? "", data.highlight);
  return {
    eyebrow: data.eyebrow,
    title: heading.highlight ? heading.lead : data.title,
    highlight: heading.highlight || data.highlight || "",
    tail: heading.tail,
    action: data.show_view_all && data.view_all_label ? { label: data.view_all_label, href: siteHref(data.view_all_url) } : null,
    members: (data.members ?? []).map(toTeamMember),
  };
}
