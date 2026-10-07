import { api } from "./api";
import { siteHref, splitHeading, toProjectCard } from "./portfolio";
import { fullTitle } from "./services";

/*
 * Public Industries API (industries-backend-spec.md):
 *   GET /api/industries-page      page copy, published industry cards, featured projects, CTA, SEO
 *   GET /api/industries?menu=1    header dropdown (show_in_menu)
 *   GET /api/industries/{slug}    one published industry (404 for drafts / unknown slugs)
 */

export const fetchIndustriesPage = () => api.get("industries-page").then((r) => r.data.data);

/* One request per page load — the navbar asks on every page. */
let menuRequest = null;
export function fetchMenuIndustries() {
  if (!menuRequest) {
    menuRequest = api.get("industries", { params: { menu: 1 } }).then((r) => r.data.data ?? []);
    // Don't keep failures around; the next page can try again.
    menuRequest.catch(() => {
      menuRequest = null;
    });
  }
  return menuRequest;
}

/** Rejects with `{ notFound: true }` when the industry doesn't exist or isn't published. */
export const fetchIndustry = (slug) =>
  api
    .get(`industries/${encodeURIComponent(slug)}`)
    .then((r) => r.data.data)
    .catch((error) => {
      const res = error?.response;
      // Laravel also answers 404 when the route itself isn't deployed — that's an API problem.
      const missingRoute = /^The route /i.test(res?.data?.message ?? "");
      throw { notFound: res?.status === 404 && !missingRoute, error };
    });

/* ---------- API → component props ---------- */

export const industryHref = (i) => i.href || `/industries/${i.slug}`;

/**
 * Display name. The highlight is part of the title ("FinTech" / "FinTech");
 * older records held only the plain part ("Financial Services &" / "FinTech").
 */
export const industryName = (i) => {
  const title = i.title ?? "";
  if (!i.highlight || title.toLowerCase().includes(i.highlight.toLowerCase())) return title;
  return `${title} ${i.highlight}`;
};

/** "Industries We Serve" card. */
export const toIndustryCard = (i, { fallbackIcon } = {}) => ({
  id: i.id ?? i.slug,
  icon: i.icon_url || fallbackIcon,
  title: industryName(i),
  description: i.short_description,
  action: { label: i.button_label || "EXPLORE", href: industryHref(i) },
});

/** Header dropdown item. */
export const toIndustryMenuItem = (i) => ({ label: industryName(i), href: industryHref(i) });

/** Banner props from `content.cta_*` — null when the CMS leaves the title empty. */
const toCta = (c) =>
  c.cta_title
    ? {
        titleLine1: c.cta_title,
        titleLine2: "",
        description: c.cta_description,
        action: { label: c.cta_button_label, href: siteHref(c.cta_button_url) },
        ...(c.cta_image && { image: { src: c.cta_image, alt: c.cta_image_alt || "" } }),
      }
    : null;

/** GET /api/industries-page → section props. */
export function toIndustriesPage(data, { fallbackIcon, fallbackImage, projectActionLabel } = {}) {
  const c = data.content ?? {};
  const heading = (prefix) => splitHeading(c[`${prefix}_title`] ?? "", c[`${prefix}_highlight`]);
  return {
    overview: { ...heading("overview"), description: c.overview_description },
    industries: {
      ...heading("industries"),
      description: c.industries_description,
      items: (data.industries ?? []).map((i) => toIndustryCard(i, { fallbackIcon })),
    },
    featuredProjects: {
      ...heading("featured_projects"),
      description: c.featured_projects_description,
      cards: (data.featured_projects ?? []).map((p) => {
        const card = toProjectCard(p, { fallbackImage });
        return { ...card, action: { label: projectActionLabel, href: card.href } };
      }),
    },
    cta: toCta(c),
    seo: { title: c.meta_title, description: c.meta_description },
  };
}

/** CTA banner shared by the Industry Details pages. */
export const toIndustriesCta = (data) => toCta(data.content ?? {});

/** GET /api/industries/{slug} → detail sections' props. */
export function toIndustryDetail(i, { fallbackIcon, fallbackImage } = {}) {
  return {
    eyebrow: i.eyebrow,
    ...splitHeading(i.title ?? "", i.highlight),
    html: i.description,
    image: i.image_url ? { src: i.image_url, alt: i.image_alt || industryName(i) } : null,
    challenges: {
      title: i.challenges_title,
      items: (i.challenges ?? []).map((c) => c.text),
    },
    caseStudies: {
      title: i.case_studies_title,
      cards: (i.projects ?? []).map((p) => toProjectCard(p, { fallbackImage })),
    },
    services: (i.services ?? []).map((s) => ({
      icon: s.icon_url || fallbackIcon,
      title: fullTitle(s),
      description: s.short_description,
      href: s.href || `/services/${s.slug}`,
    })),
    seo: {
      title: i.meta_title || `${industryName(i)} | Intellivex`,
      description: i.meta_description || i.short_description,
    },
  };
}
