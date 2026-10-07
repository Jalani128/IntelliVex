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
import { fetchService, toServiceDetail } from "../services/services";

/* Built-in content: /services/details, and any slug while the API is unreachable. */
const FALLBACK = { intro: SERVICE_INTRO, benefits: SERVICE_BENEFITS, faq: SERVICE_FAQ, seo: null };

/**
 * /services/:slug — one published service from the API
 * (GET /api/services/{slug}). Unknown slugs go back to /services;
 * network or server errors keep the built-in page so it never renders empty.
 */
export default function ServiceDetail() {
  const { slug } = useParams();
  const [content, setContent] = useState(FALLBACK);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return undefined;
    let alive = true;
    setNotFound(false);
    fetchService(slug)
      .then((service) => alive && setContent(toServiceDetail(service, SERVICE_INTRO)))
      .catch((err) => alive && err?.notFound && setNotFound(true));
    return () => {
      alive = false;
    };
  }, [slug]);

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

  if (notFound) return <Navigate to="/services" replace />;

  const { intro, benefits, faq } = content;

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
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
