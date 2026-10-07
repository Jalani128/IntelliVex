import { api } from "./api";
import { siteHref, splitHeading } from "./portfolio";

/*
 * Public page-content API (pages-content-backend-spec.md) — one row per page:
 *   GET /api/home-page       Key Differentiators, "Our Services" heading, CTA
 *   GET /api/about-page      Company Overview, Trusted Partners, Vision / Mission,
 *                            How We Deliver, Key Differentiators, CTA
 *   GET /api/services-page   Services Overview, "Our Services" heading, CTA
 * Service cards come from /api/services (services.js).
 *
 * Every mapper takes the page's built-in content as `fallback`, so an empty
 * field — or a missing endpoint, via useApiData — keeps what the site shows today.
 */

export const fetchHomePage = () => api.get("home-page").then((r) => r.data.data);
export const fetchAboutPage = () => api.get("about-page").then((r) => r.data.data);
export const fetchServicesPage = () => api.get("services-page").then((r) => r.data.data);

/* ---------- API → component props ---------- */

/** A blank line in the CMS text starts a new paragraph. */
const paragraphs = (text) =>
  (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** `{prefix}_title` holds the whole heading, `{prefix}_highlight` the gradient phrase inside it. */
function heading(d, prefix, fallback) {
  const text = d[`${prefix}_title`];
  if (!text) return { title: fallback.title, highlight: fallback.highlight, tail: fallback.tail };
  const { lead, highlight, tail } = splitHeading(text, d[`${prefix}_highlight`]);
  return highlight ? { title: lead, highlight, tail } : { title: text, highlight: "", tail: "" };
}

/** Eyebrow + heading + intro, the SectionHeading shape. */
const section = (d, prefix, fallback) => ({
  ...fallback,
  eyebrow: d[`${prefix}_eyebrow`] || fallback.eyebrow,
  ...heading(d, prefix, fallback),
  ...(fallback.description !== undefined && {
    description: d[`${prefix}_description`] ?? fallback.description,
  }),
});

const differentiators = (d, fallback) => ({
  ...section(d, "differentiators", fallback),
  items: d.differentiators_items?.length ? d.differentiators_items : fallback.items,
});

/** CTABanner `content`. */
const cta = (d, fallback) =>
  d.cta_title_line1
    ? {
        ...fallback,
        titleLine1: d.cta_title_line1,
        titleLine2: d.cta_title_line2 ?? "",
        description: d.cta_description ?? "",
        action: { label: d.cta_button_label || fallback.action.label, href: siteHref(d.cta_button_link) || fallback.action.href },
      }
    : fallback;

/** GET /api/home-page → { differentiators, services, cta } (services = heading of the card grid). */
export const toHomePage = (d, fallback) => ({
  differentiators: differentiators(d, fallback.differentiators),
  services: section(d, "services", fallback.services),
  cta: cta(d, fallback.cta),
});

/** GET /api/about-page → { overview, process, differentiators, cta }. */
export function toAboutPage(d, fallback) {
  const { overview: o, process: p } = fallback;
  const plate = (prefix, base) => ({
    ...base,
    ...heading(d, prefix, base),
    description: d[`${prefix}_description`] || base.description,
  });
  const steps = d.process_steps?.length ? d.process_steps : null;

  return {
    overview: {
      ...o,
      eyebrow: d.overview_eyebrow || o.eyebrow,
      ...heading(d, "overview", o),
      paragraphs: paragraphs(d.overview_description).length ? paragraphs(d.overview_description) : o.paragraphs,
      partners: {
        ...plate("partners", o.partners),
        rating: d.partners_rating ?? o.partners.rating,
        logo: d.partners_logo_url ? { src: d.partners_logo_url, alt: o.partners.logo.alt } : o.partners.logo,
      },
      pillars: [plate("vision", o.pillars[0]), plate("mission", o.pillars[1])],
    },
    process: {
      ...section(d, "process", p),
      steps: p.steps.map((step, i) => ({
        ...step,
        title: steps?.[i]?.title || step.title,
        description: steps?.[i]?.description || step.description,
      })),
    },
    differentiators: differentiators(d, fallback.differentiators),
    cta: cta(d, fallback.cta),
  };
}

/** GET /api/services-page → { overview, services, cta }. */
export function toServicesPage(d, fallback) {
  const o = fallback.overview;
  const { title, highlight, tail } = heading(d, "overview", { title: o.titleLine1, highlight: o.highlight, tail: o.titleTail });
  const text = paragraphs(d.overview_description);
  return {
    overview: {
      eyebrow: d.overview_eyebrow || o.eyebrow,
      titleLine1: title,
      highlight,
      titleTail: tail,
      paragraphs: text.length ? text : o.paragraphs,
      image: d.overview_image_url ? { src: d.overview_image_url, alt: d.overview_image_alt || o.image.alt } : o.image,
    },
    services: section(d, "services", fallback.services),
    cta: cta(d, fallback.cta),
  };
}
