import { api } from "./api";

/*
 * Public Services API (as deployed on the Laravel server):
 *   GET /api/services              catalog   (show_on_services_page)
 *   GET /api/services?featured=1   home grid (is_featured)
 *   GET /api/services?menu=1       header dropdown (show_in_menu)
 *   GET /api/services/{slug}       detail page
 * Only published services come back, ordered by sort_order.
 */

/* One request per list per page load — the navbar asks on every page. */
const cache = new Map();

function getList(params) {
  const key = JSON.stringify(params);
  if (!cache.has(key)) {
    const request = api.get("services", { params }).then((r) => r.data.data ?? []);
    // Don't keep failures around; the next page can try again.
    request.catch(() => cache.delete(key));
    cache.set(key, request);
  }
  return cache.get(key);
}

export const fetchCatalogServices = () => getList({});
export const fetchFeaturedServices = () => getList({ featured: 1 });
export const fetchMenuServices = () => getList({ menu: 1 });

/**
 * Rejects with `{ notFound: true }` when the service doesn't exist, so the page can redirect.
 * Laravel also answers 404 when the route itself isn't deployed ("The route … could not be
 * found.") — that's an API problem, not a missing service, so the page keeps its fallback.
 */
export const fetchService = (slug) =>
  api
    .get(`services/${encodeURIComponent(slug)}`)
    .then((r) => r.data.data)
    .catch((error) => {
      const res = error?.response;
      const missingRoute = /^The route /i.test(res?.data?.message ?? "");
      throw { notFound: res?.status === 404 && !missingRoute, error };
    });

/* ---------- API → component props ---------- */

const hrefOf = (s) => s.href || `/services/${s.slug}`;

/*
 * The API sends the whole title with `highlight` as a part of it
 * ("Web Development" / "Development"); older rows may hold only the plain
 * part ("AI &" / "Data Innovation"). Both come out the same below.
 */
const highlightAt = (s) => (s.highlight ? (s.title ?? "").lastIndexOf(s.highlight) : -1);

/** "Web Development" (highlight "Development") → "Web Development" */
export const fullTitle = (s) =>
  highlightAt(s) >= 0 ? s.title : [s.title, s.highlight].filter(Boolean).join(" ");

/** Heading parts: plain lead + gradient remainder → { title: "Web", highlight: "Development" } */
export function splitTitle(s) {
  const at = highlightAt(s);
  if (at < 0) return { title: s.title, highlight: s.highlight };
  return { title: s.title.slice(0, at).trim(), highlight: s.title.slice(at).trim() };
}

/**
 * Card tag pills: the service's own `tags` (strings, or { text } rows sorted by
 * sort_order) — services saved before tags existed show their sub-services instead.
 */
export function cardTags(s) {
  const own = [...(s.tags ?? [])]
    .sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
    .map((t) => (typeof t === "string" ? t : t?.text))
    .filter(Boolean);
  return own.length ? own : (s.children ?? []).map((c) => fullTitle(c));
}

/** ServiceCard props (home grid, catalog). */
export const toServiceCard = (s, fallbackIcon) => ({
  icon: s.icon_url || fallbackIcon,
  title: fullTitle(s),
  description: s.short_description,
  tags: cardTags(s),
  href: hrefOf(s),
});

/** Catalog cell: normal card, or the innovation card with its sub-services as pills. */
export const toCatalogItem = (s, fallbackIcon) =>
  s.card_variant === "innovation"
    ? {
        variant: "innovation",
        ...splitTitle(s),
        tags: cardTags(s),
        href: hrefOf(s),
      }
    : toServiceCard(s, fallbackIcon);

/**
 * Every published service in the catalog response (and its sub-services), in
 * sort order, as linked pills: [{ label, href }].
 */
export const toServiceLinks = (rows) =>
  rows.flatMap((s) => [s, ...(s.children ?? [])]).map((s) => ({ label: fullTitle(s), href: hrefOf(s) }));

/** Header dropdown item. */
export const toMenuItem = (s) => ({ label: fullTitle(s), href: hrefOf(s) });

/**
 * Header dropdown list. The menu API returns top-level services with their
 * sub-services nested under `children`; a parent is listed as its sub-services
 * (Engineering, Mobile Development, …), a service without any as itself.
 */
export const toMenuItems = (rows) =>
  rows.flatMap((s) => (s.children?.length ? s.children : [s])).map(toMenuItem);

/**
 * Detail response → the three section components' `content` props.
 * `fallback` supplies the image when the service has none.
 */
export function toServiceDetail(s, fallback) {
  // Pills: a parent shows itself + its children; a child shows its siblings with itself active.
  const self = { label: fullTitle(s), active: true };
  const related = [...(s.children ?? []), ...(s.siblings ?? [])]
    .filter((r) => r.slug !== s.slug)
    .map((r) => ({ label: fullTitle(r), to: hrefOf(r) }));
  const tags = related.length ? [self, ...related] : undefined;

  return {
    intro: {
      eyebrow: s.eyebrow || "Service",
      ...splitTitle(s),
      html: s.description,
      tags,
      image: s.image_url
        ? { src: s.image_url, alt: s.image_alt || fullTitle(s), width: tags ? 651 : 1061, height: 409 }
        : { ...fallback.image, alt: s.image_alt || fallback.image.alt },
    },
    benefits: {
      title: s.benefits_title || "Our Benefits",
      description: s.benefits_description,
      items: (s.benefits ?? []).map((b) => b.text),
    },
    faq: {
      title: "Frequently Asked Questions",
      items: (s.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
    },
    seo: {
      title: s.seo?.meta_title || s.meta_title || `${fullTitle(s)} | Intellivex`,
      description: s.seo?.meta_description || s.meta_description || s.short_description,
    },
  };
}
