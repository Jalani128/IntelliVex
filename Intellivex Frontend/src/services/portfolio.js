import { api } from "./api";

/*
 * Public Portfolio API (portfolio-projects-backend-spec.md §4):
 *   GET /api/portfolio-page                   headings, category pills, CTA, SEO
 *   GET /api/projects?category=&page=         portfolio grid (published, by sort_order)
 *   GET /api/projects?home=1                  Home page "Projects" (max 2)
 *   GET /api/projects?featured=1              Industries "Featured Projects"
 *   GET /api/projects/{slug}                  Project Details (404 for drafts / unknown slugs)
 */

export const fetchPortfolioPage = () => api.get("portfolio-page").then((r) => r.data.data);

/** Resolves to `{ data, meta }` — `meta.has_more` drives "Load More". */
export const fetchProjects = (params = {}) => api.get("projects", { params }).then((r) => r.data);

/** Rejects with `{ notFound: true }` when the project doesn't exist or isn't published. */
export const fetchProject = (slug) =>
  api
    .get(`projects/${encodeURIComponent(slug)}`)
    .then((r) => r.data.data)
    .catch((error) => {
      const res = error?.response;
      // Laravel also answers 404 when the route itself isn't deployed — that's an API problem.
      const missingRoute = /^The route /i.test(res?.data?.message ?? "");
      throw { notFound: res?.status === 404 && !missingRoute, error };
    });

/* ---------- API → component props ---------- */

const projectHref = (p) => p.href || `/portfolio/${p.slug}`;

/** Links to this site come back as full URLs; keep them client-side routes. */
export function siteHref(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin === window.location.origin) return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    /* not a URL — use as is */
  }
  return url;
}

/**
 * The API sends the whole heading with `highlight` as a phrase inside it:
 * "Work that creates real impact" / "real impact" → lead + gradient + tail.
 * Matched case-insensitively (the Industries API allows that); the heading's own casing is kept.
 */
export function splitHeading(text = "", highlight) {
  const at = highlight ? text.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (at < 0) return { lead: text, highlight: "", tail: "" };
  return {
    lead: text.slice(0, at).trim(),
    highlight: text.slice(at, at + highlight.length),
    tail: text.slice(at + highlight.length).trim(),
  };
}

/** ProjectCard props. `fallbackImage` covers projects without a card image. */
export const toProjectCard = (p, { actionLabel, fallbackImage } = {}) => ({
  id: p.id,
  badge: p.badge,
  title: p.title,
  description: p.short_description,
  tags: p.tags ?? [],
  image: p.card_image_url || fallbackImage,
  fallbackImage,
  imageAlt: p.card_image_alt || p.title,
  href: projectHref(p),
  ...(actionLabel && { actionLabel }),
});

/** Portfolio page singleton → section props. */
export function toPortfolioPage(page) {
  const allPill = page.show_all_filter ? [{ slug: null, label: page.all_filter_label || "All" }] : [];
  return {
    overview: {
      eyebrow: page.overview_eyebrow,
      ...splitHeading(page.overview_title, page.overview_highlight),
      description: page.overview_description,
    },
    pills: [...allPill, ...(page.categories ?? []).map((c) => ({ slug: c.slug, label: c.title }))],
    showAll: Boolean(page.show_all_filter),
    projects: {
      eyebrow: page.projects_eyebrow,
      ...splitHeading(page.projects_title, page.projects_highlight),
      description: page.projects_description,
    },
    cardButtonLabel: page.card_button_label,
    loadMoreLabel: page.load_more_label,
    cta: page.is_cta_active
      ? {
          titleLine1: page.cta_title,
          titleLine2: "",
          description: page.cta_description,
          action: { label: page.cta_button_label, href: siteHref(page.cta_button_url) },
          ...(page.cta_image_url && { image: { src: page.cta_image_url, alt: page.cta_image_alt || "" } }),
        }
      : null,
    seo: { title: page.meta_title, description: page.meta_description },
  };
}

/** Project detail response → the detail sections' `data` prop. */
export function toProjectDetail(p) {
  const industryHref = p.linked_industry?.slug ? `/industries/${p.linked_industry.slug}` : null;
  const heroSrc = p.hero_image_url || p.card_image_url;
  const heading = splitHeading(p.heading || p.title, p.highlight);

  return {
    eyebrow: "OUR RECENT WORKS",
    titleLine: heading.lead,
    highlight: heading.highlight,
    titleTail: heading.tail,
    html: p.description,
    clientLabel: "Client / Industry",
    clientValue: p.client_industry_text,
    clientHref: siteHref(p.client_industry_url) || industryHref,
    tags: p.tags ?? [],
    projectUrl: p.project_url,
    images: {
      hero: heroSrc ? { src: heroSrc, alt: (p.hero_image_url ? p.hero_image_alt : p.card_image_alt) || p.title } : null,
      title: p.case_studies_title,
      gallery: (p.gallery ?? []).map((g) => ({ src: g.image_url, alt: g.image_alt || p.title })),
    },
    challenge: {
      title: p.challenge_title,
      description: p.challenge_description,
      items: (p.challenges ?? []).map((c) => c.text),
    },
    navigation: {
      prev: p.previous ? { label: "Previous Project", title: p.previous.title, to: projectHref(p.previous) } : null,
      next: p.next ? { label: "Next Project", title: p.next.title, to: projectHref(p.next) } : null,
    },
    seo: { title: `${p.title} | Intellivex`, description: p.short_description },
  };
}
