import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import IndustryDetailHero from "../components/IndustryDetailHero";
import IndustryDetailChallenges from "../components/IndustryDetailChallenges";
import IndustryDetailServices from "../components/IndustryDetailServices";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { INDUSTRY_DETAIL_HEADER, SERVICE_ICON_FALLBACK } from "../data/industryDetail";
import { PROJECT_IMAGE_PLACEHOLDER } from "../data/portfolio";
import { fetchIndustriesPage, fetchIndustry, toIndustriesCta, toIndustryDetail } from "../services/industries";
import { usePageMeta } from "../hooks/usePageMeta";

function DetailSkeleton() {
  return (
    <section className="relative bg-navy pb-16 pt-6 sm:pt-8 lg:pt-10" aria-busy="true" aria-label="Loading industry">
      <div className="container-narrow relative animate-pulse">
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="mt-4 h-12 max-w-[640px] rounded bg-white/10" />
        <div className="mt-6 h-24 max-w-[1060px] rounded bg-white/[0.06]" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-6 rounded bg-white/[0.06]" />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * /industries/:slug — one published industry (GET /api/industries/{slug}).
 * Drafts and unknown slugs (404) go back to /industries.
 */
export default function IndustryDetail() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", data: null });
  const [attempt, setAttempt] = useState(0);
  // CTA banner is shared with the Industries page; the default banner when it's empty or fails.
  const [cta, setCta] = useState(null);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading", data: null });
    fetchIndustry(slug)
      .then(
        (industry) =>
          alive &&
          setState({
            status: "ready",
            data: toIndustryDetail(industry, { fallbackIcon: SERVICE_ICON_FALLBACK, fallbackImage: PROJECT_IMAGE_PLACEHOLDER }),
          }),
      )
      .catch((err) => alive && setState({ status: err?.notFound ? "notFound" : "error", data: null }));
    return () => {
      alive = false;
    };
  }, [slug, attempt]);

  useEffect(() => {
    let alive = true;
    fetchIndustriesPage()
      .then((page) => alive && setCta(toIndustriesCta(page)))
      .catch(() => {
        /* keep the default banner */
      });
    return () => {
      alive = false;
    };
  }, []);

  usePageMeta(state.data?.seo.title, state.data?.seo.description);

  if (state.status === "notFound") return <Navigate to="/industries" replace />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={
            <>
              <span className="text-gradient">Industry</span> Details
            </>
          }
          breadcrumbs={INDUSTRY_DETAIL_HEADER.breadcrumbs}
        />

        {state.status === "loading" && <DetailSkeleton />}

        {state.status === "error" && (
          <section className="relative bg-navy pb-16 pt-10">
            <div className="container-narrow surface-card flex flex-col items-center gap-5 px-6 py-12 text-center">
              <p className="font-body text-[15px] text-white/75">We couldn’t load this industry. Please try again.</p>
              <button
                type="button"
                onClick={() => setAttempt((n) => n + 1)}
                className="cursor-pointer rounded-full border border-white/20 bg-white/[0.04] px-8 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70 transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:text-white"
              >
                Try Again
              </button>
            </div>
          </section>
        )}

        {state.data && (
          <>
            <IndustryDetailHero data={state.data} />
            <IndustryDetailChallenges data={state.data} />
            <IndustryDetailServices data={state.data} />
          </>
        )}

        {cta ? <CTABanner content={cta} /> : <CTABanner />}
      </main>
      <Footer />
    </div>
  );
}
