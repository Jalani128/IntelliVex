import { api } from "./api";
import { siteHref, splitHeading } from "./portfolio";

/*
 * Public Testimonials / Client Stories API (testimonials-backend-spec.md §6):
 *   GET /api/testimonials-page   content, logo-bar clients, portfolio clients,
 *                                reviews, featured + regular success stories
 *   GET /api/clients/{slug}      one published Client Portfolio client with its
 *                                related reviews and success stories (404 otherwise)
 */

export const fetchTestimonialsPage = () => api.get("testimonials-page").then((r) => r.data.data);

/** Rejects with `{ notFound: true }` when the client doesn't exist, isn't published or isn't in the portfolio. */
export const fetchClient = (slug) =>
  api
    .get(`clients/${encodeURIComponent(slug)}`)
    .then((r) => r.data.data)
    .catch((error) => {
      const res = error?.response;
      // Laravel also answers 404 when the route itself isn't deployed — that's an API problem.
      const missingRoute = /^The route /i.test(res?.data?.message ?? "");
      throw { notFound: res?.status === 404 && !missingRoute, error };
    });

/* ---------- API → component props ---------- */

const clientHref = (c) => c.href || `/client-portfolio/${c.slug}`;

/** Logo-bar item; links to the client's website when it has one. */
export const toLogo = (c) => ({ id: c.id ?? c.slug, src: c.logo_url, alt: `${c.name} logo`, name: c.name, href: c.website || null });

/** Client Portfolio grid card. */
export const toClientCard = (c) => ({ id: c.id ?? c.slug, name: c.name, industry: c.industry, logo: c.logo_url, href: clientHref(c) });

/** Review card (TestimonialCard props). */
export const toReview = (r) => ({
  id: r.id,
  rating: r.rating,
  quote: r.quote,
  name: r.client_name,
  role: [r.designation, r.company].filter(Boolean).join(", "),
  initials: r.avatar_initials,
  avatar: r.avatar_url,
});

/** Success-story card. `fallbackImage` covers stories without an image. */
export const toStory = (s, fallbackImage) => ({
  id: s.id,
  title: s.title,
  image: s.image_url || fallbackImage,
  fallbackImage,
  href: siteHref(s.link),
});

/** GET /api/testimonials-page → section props. */
export function toTestimonialsPage(data, { eyebrows, fallbackStoryImage }) {
  const c = data.content ?? {};
  const heading = (prefix) => splitHeading(c[`${prefix}_title`] ?? "", c[`${prefix}_highlight`]);
  return {
    logos: (data.logo_bar_clients ?? []).map(toLogo),
    portfolio: {
      eyebrow: eyebrows.clients,
      ...heading("clients"),
      paragraphs: c.clients_description ? [c.clients_description] : [],
      clients: (data.portfolio_clients ?? []).map(toClientCard),
    },
    reviews: {
      eyebrow: eyebrows.reviews,
      ...heading("reviews"),
      description: c.reviews_description,
      items: (data.reviews ?? []).map(toReview),
    },
    stories: {
      eyebrow: eyebrows.stories,
      ...heading("stories"),
      description: c.stories_description,
      featured: (data.featured_success_stories ?? []).map((s) => toStory(s, fallbackStoryImage)),
      items: (data.success_stories ?? []).map((s) => toStory(s, fallbackStoryImage)),
    },
    cta: c.cta_title
      ? {
          titleLine1: c.cta_title,
          titleLine2: "",
          description: c.cta_description,
          action: { label: c.cta_button_label, href: siteHref(c.cta_button_url) },
          ...(c.cta_image && { image: { src: c.cta_image, alt: c.cta_image_alt || "" } }),
        }
      : null,
    seo: { title: c.meta_title, description: c.meta_description },
  };
}

/** GET /api/clients/{slug} → Client Portfolio Details props. */
export function toClientDetail(c, { eyebrow, fallbackStoryImage }) {
  const heading = c.heading || c.portfolio_heading || c.name;
  const stories = (c.success_stories ?? []).map((s) => toStory(s, fallbackStoryImage));
  return {
    hero: {
      eyebrow: c.industry || eyebrow,
      // The client's name, when it's part of the heading, gets the gradient.
      ...splitHeading(heading, c.name),
      html: c.description ?? c.portfolio_description,
      name: c.name,
      logo: c.logo_url,
      website: c.website,
    },
    successStory: c.success_story
      ? {
          title: "Success Stories",
          html: c.success_story,
          // The client's first related story image, else the placeholder.
          image: { src: stories[0]?.image || fallbackStoryImage, alt: stories[0]?.title || c.name, fallback: fallbackStoryImage },
        }
      : null,
    stories,
    reviews: (c.testimonials ?? []).map(toReview),
    seo: { title: `${c.name} | Client Portfolio | Intellivex`, description: heading },
  };
}
