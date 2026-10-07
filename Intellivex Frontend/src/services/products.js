import { api } from "./api";
import { siteHref, splitHeading } from "./portfolio";

/*
 * Public Products API (products-backend-spec.md §4):
 *   GET /api/products-page     page copy, active categories, all published products,
 *                              featured / showcase subsets, deployable solutions,
 *                              the two Use Case industries, CTA and SEO
 *   GET /api/products/{slug}   one published product (404 for drafts / unknown slugs)
 */

export const fetchProductsPage = () => api.get("products-page").then((r) => r.data.data);

/** Rejects with `{ notFound: true }` when the product doesn't exist or isn't published. */
export const fetchProduct = (slug) =>
  api
    .get(`products/${encodeURIComponent(slug)}`)
    .then((r) => r.data.data)
    .catch((error) => {
      const res = error?.response;
      // Laravel also answers 404 when the route itself isn't deployed — that's an API problem.
      const missingRoute = /^The route /i.test(res?.data?.message ?? "");
      throw { notFound: res?.status === 404 && !missingRoute, error };
    });

/* ---------- API → component props ---------- */

const isExternal = (href) => /^https?:\/\//i.test(href ?? "");
export const productHref = (p) => p.href || `/products/${p.slug}`;

/**
 * ProjectCard props for a product. `demo` makes the card's button "VIEW DEMO"
 * (falls back to the product page when there's no demo URL).
 */
export function toProductCard(p, { detailsLabel, demoLabel, demo = false, fallbackImage } = {}) {
  const demoHref = demo && p.demo_url ? siteHref(p.demo_url) : null;
  return {
    id: p.id,
    badge: p.badge,
    title: p.title,
    description: p.short_description,
    tags: p.tags ?? [],
    image: p.image_url || fallbackImage,
    fallbackImage,
    imageAlt: p.image_alt || p.title,
    href: demoHref || productHref(p),
    actionLabel: (demoHref ? demoLabel : detailsLabel) || undefined,
    category: p.category?.slug ?? null,
  };
}

/** GET /api/products-page → section props. */
export function toProductsPage(data, { fallbackImage } = {}) {
  const c = data.content ?? {};
  const heading = (prefix) => splitHeading(c[`${prefix}_title`] ?? "", c[`${prefix}_highlight`]);
  const labels = { detailsLabel: c.product_button_label, demoLabel: c.demo_button_label, fallbackImage };

  return {
    overview: { eyebrow: c.hero_eyebrow, ...heading("hero"), description: c.hero_description },
    featured: { ...heading("featured"), cards: (data.featured_products ?? []).map((p) => toProductCard(p, labels)) },
    categories: {
      ...heading("categories"),
      pills: (data.categories ?? []).map((cat) => ({ slug: cat.slug, label: cat.title })),
      products: (data.products ?? []).map((p) => toProductCard(p, labels)),
    },
    deployable: {
      ...heading("deployable"),
      buttonLabel: c.deployable_button_label,
      items: (data.deployable_solutions ?? []).map((s) => ({
        id: s.id,
        icon: s.icon_url,
        title: s.title,
        description: s.description,
        href: siteHref(s.link),
        external: isExternal(siteHref(s.link)),
      })),
    },
    useCases: {
      ...heading("use_cases"),
      viewAllLabel: c.view_all_button_label,
      buttonLabel: c.deployable_button_label,
      items: (c.use_case_industries ?? []).map((i) => ({
        id: i.id ?? i.slug,
        icon: i.icon_url,
        title: [i.title, i.highlight].filter(Boolean).join(" "),
        description: i.short_description ?? i.description,
        href: i.href || `/industries/${i.slug}`,
      })),
    },
    showcase: { ...heading("showcase"), cards: (data.showcase_products ?? []).map((p) => toProductCard(p, { ...labels, demo: true })) },
    cta: c.cta_title
      ? {
          titleLine1: c.cta_title,
          titleLine2: "",
          description: c.cta_description,
          action: { label: c.cta_button_label, href: siteHref(c.cta_button_url) },
          ...(c.cta_image_url && { image: { src: c.cta_image_url, alt: c.cta_image_alt || "" } }),
        }
      : null,
    seo: { title: c.meta_title, description: c.meta_description },
  };
}

/** Product detail → the shared Project Details sections' `data` prop. */
export function toProductDetail(p, { demoLabel } = {}) {
  return {
    eyebrow: p.badge || "Our Products",
    titleLine: p.title,
    highlight: "",
    titleTail: "",
    html: p.description || `<p>${p.short_description ?? ""}</p>`,
    clientLabel: "Category",
    clientValue: p.category?.title,
    clientHref: null,
    tags: p.tags ?? [],
    action: p.demo_url ? { label: demoLabel || "View Demo", href: siteHref(p.demo_url) } : null,
    images: {
      hero: p.image_url ? { src: p.image_url, alt: p.image_alt || p.title } : null,
      title: "Gallery",
      gallery: (p.gallery ?? []).map((g) => ({ src: g.image_url, alt: g.image_alt || p.title })),
    },
    challenge: { title: "Key Features", description: null, items: p.features ?? [] },
    navigation: { prev: null, next: null },
    seo: { title: `${p.title} | Intellivex`, description: p.short_description },
  };
}
