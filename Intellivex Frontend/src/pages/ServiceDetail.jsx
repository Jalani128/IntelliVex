import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ServiceIntro from "../components/ServiceIntro";
import ServiceBenefits from "../components/ServiceBenefits";
import ServiceFaq from "../components/ServiceFaq";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { SERVICE_DETAIL_HEADER, SERVICE_INTRO, SERVICE_BENEFITS, SERVICE_FAQ } from "../data/serviceDetail";
import { subServicesFor } from "../data/services";
import { serviceDetailFor } from "../data/serviceDetails";
import { cardTags, fetchService, fullTitle, subServiceSlug, toServiceDetail } from "../services/services";

/** "DevOps & CI/CD" → { title: "DevOps &", highlight: "CI/CD" } — last word in the gradient, like other headings. */
function splitLastWord(label) {
  const at = label.lastIndexOf(" ");
  return at < 0 ? { title: "", highlight: label } : { title: label.slice(0, at), highlight: label.slice(at + 1) };
}

/**
 * Sub-service pages and pills. A service's sub-services are its own `tags` from the
 * API, or the content file's list for it. Its detail page lists them as pills after
 * itself; each opens /services/{slug}/{sub}, which is the same page headed by the
 * sub-service (eyebrow = the service) with that pill active. Services that already
 * have child services in Admin keep the API's parent / child pills instead.
 * Returns null when `sub` isn't one of the service's sub-services.
 */
function withSubServices(detail, service, sub) {
  if (detail.intro.tags && !sub) return detail;
  const name = fullTitle(service);
  const own = cardTags({ ...service, children: [] });
  const subs = own.length ? own : subServicesFor(name);
  if (!subs.length) return sub ? null : detail;

  const base = `/services/${service.slug}`;
  const current = sub ? subs.find((label) => subServiceSlug(label) === sub) : null;
  if (sub && !current) return null;

  const tags = [
    { label: name, active: !current, to: current ? base : undefined },
    ...subs.map((label) => (label === current ? { label, active: true } : { label, to: `${base}/${subServiceSlug(label)}` })),
  ];
  return {
    ...detail,
    intro: {
      ...detail.intro,
      ...(current && { eyebrow: name, ...splitLastWord(current) }),
      tags,
      // The pills sit beside the image, so it takes the narrower column.
      image: { ...detail.intro.image, width: 651 },
    },
    seo: current ? { title: `${current} | ${name} | Intellivex`, description: detail.seo?.description } : detail.seo,
    subLabel: current ?? null,
  };
}

/** Admin text that is still the Lorem ipsum placeholder counts as missing. */
const isPlaceholder = (text) => !text || /lorem ipsum/i.test(text);

/** "Reimagine your business with Intellivex" → the CTA banner's two lines (break after "your"). */
function toCta(cta) {
  const words = cta.heading.split(" ");
  return {
    titleLine1: words.slice(0, 2).join(" "),
    titleLine2: words.slice(2).join(" "),
    description: cta.text,
    action: { label: cta.button, href: "/contact" },
  };
}

/**
 * Page copy from the service documents (data/serviceDetails.js).
 * Service pages: the API's text wins once it is real; placeholder text is replaced
 * by the document's. Sub-service pages have no API record, so they take everything
 * from the document — intro, their own tags, benefits and FAQs. The closing banner
 * text always comes from the document (the API has no field for it).
 */
function withPageContent(detail, service) {
  const name = fullTitle(service);
  const doc = serviceDetailFor(name, detail.subLabel);
  if (!doc) return detail;
  const sub = Boolean(detail.subLabel);

  const introFromApi = !sub && !isPlaceholder(detail.intro.html);
  const benefitsFromApi = !sub && !isPlaceholder(detail.benefits.description) && detail.benefits.items.every((t) => !isPlaceholder(t));
  const faqsFromApi = !sub && detail.faq.items.length > 0 && detail.faq.items.every((f) => !isPlaceholder(f.answer));

  return {
    ...detail,
    intro: {
      ...detail.intro,
      ...(sub && { eyebrow: doc.eyebrow, ...splitLastWord(doc.title) }),
      ...(!introFromApi && { html: undefined, paragraphs: doc.intro }),
      // A sub-service page lists its own capabilities (no pages of their own).
      ...(sub && { tags: doc.tags.map((label) => ({ label })) }),
    },
    benefits: benefitsFromApi ? detail.benefits : { ...detail.benefits, description: doc.benefits.description, items: doc.benefits.items },
    faq: faqsFromApi ? detail.faq : { ...detail.faq, items: doc.faqs },
    cta: toCta(doc.cta),
    seo: { title: detail.seo?.title, description: isPlaceholder(detail.seo?.description) || sub ? doc.intro[0] : detail.seo.description },
  };
}

/* Built-in content: /services/details, and any slug while the API is unreachable. */
const FALLBACK = { intro: SERVICE_INTRO, benefits: SERVICE_BENEFITS, faq: SERVICE_FAQ, seo: null };

/**
 * /services/:slug — one published service from the API
 * (GET /api/services/{slug}). Unknown slugs go back to /services;
 * network or server errors keep the built-in page so it never renders empty.
 */
export default function ServiceDetail() {
  const { slug, sub } = useParams();
  const [content, setContent] = useState(FALLBACK);
  // Remembers which URL was not found: React keeps this page mounted when moving
  // between /services/:slug and /services/:slug/:sub, so a plain flag would carry over.
  const pageKey = sub ? `${slug}/${sub}` : slug;
  const [notFoundKey, setNotFoundKey] = useState(null);
  const notFound = notFoundKey === pageKey;

  useEffect(() => {
    if (!slug) return undefined;
    let alive = true;
    fetchService(slug)
      .then((service) => {
        if (!alive) return;
        const withSubs = withSubServices(toServiceDetail(service, SERVICE_INTRO), service, sub);
        const detail = withSubs && withPageContent(withSubs, service);
        // An unknown sub-service goes back to its service's page.
        if (detail) setContent(detail);
        else setNotFoundKey(pageKey);
      })
      .catch((err) => alive && err?.notFound && setNotFoundKey(pageKey));
    return () => {
      alive = false;
    };
  }, [slug, sub, pageKey]);

  // Page title / description from the service's SEO fields.
  useEffect(() => {
    if (!content.seo) return undefined;
    const previous = document.title;
    document.title = content.seo.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content");
    if (meta && content.seo.description) meta.setAttribute("content", content.seo.description);
    return () => {
      document.title = previous;
      if (meta && previousDescription != null) meta.setAttribute("content", previousDescription);
    };
  }, [content.seo]);

  if (notFound) return <Navigate to={sub ? `/services/${slug}` : "/services"} replace />;

  const { intro, benefits, faq, cta } = content;

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={SERVICE_DETAIL_HEADER.title}
          breadcrumbs={SERVICE_DETAIL_HEADER.breadcrumbs}
          gradient
        />
        <ServiceIntro content={intro} />
        {(benefits.description || benefits.items.length > 0) && <ServiceBenefits content={benefits} />}
        {faq.items.length > 0 && <ServiceFaq content={faq} />}
        {cta ? <CTABanner content={cta} /> : <CTABanner />}
      </main>
      <Footer />
    </div>
  );
}
