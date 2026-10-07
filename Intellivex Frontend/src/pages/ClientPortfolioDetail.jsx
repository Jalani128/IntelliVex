import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ClientPortfolioHero from "../components/ClientPortfolioHero";
import ClientPortfolioSuccessStory from "../components/ClientPortfolioSuccessStory";
import SuccessStories from "../components/SuccessStories";
import TestimonialsReviews from "../components/TestimonialsReviews";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { CLIENT_PORTFOLIO_DETAIL_HEADER, CLIENT_EYEBROW, RELATED_SECTIONS } from "../data/clientPortfolioDetail";
import { STORY_IMAGE_PLACEHOLDER } from "../data/testimonials";
import { fetchClient, toClientDetail } from "../services/testimonials";
import { usePageMeta } from "../hooks/usePageMeta";

function DetailSkeleton() {
  return (
    <section className="relative bg-navy pb-16 pt-6 sm:pt-8 lg:pt-10" aria-busy="true" aria-label="Loading client">
      <div className="container-narrow relative grid animate-pulse grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
        <div>
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="mt-4 h-12 max-w-[640px] rounded bg-white/10" />
          <div className="mt-8 h-32 rounded bg-white/[0.06]" />
        </div>
        <div className="surface-card h-[280px] rounded-card sm:h-[320px] lg:h-[350px]" />
      </div>
    </section>
  );
}

/**
 * /client-portfolio/:slug — one published Client Portfolio client
 * (GET /api/clients/{slug}) with its related success stories and reviews.
 * Hidden, draft and unknown clients (404) go back to /testimonials.
 */
export default function ClientPortfolioDetail() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", data: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading", data: null });
    fetchClient(slug)
      .then(
        (client) =>
          alive &&
          setState({ status: "ready", data: toClientDetail(client, { eyebrow: CLIENT_EYEBROW, fallbackStoryImage: STORY_IMAGE_PLACEHOLDER }) }),
      )
      .catch((err) => alive && setState({ status: err?.notFound ? "notFound" : "error", data: null }));
    return () => {
      alive = false;
    };
  }, [slug, attempt]);

  const data = state.data;
  usePageMeta(data?.seo.title, data?.seo.description);

  if (state.status === "notFound") return <Navigate to="/testimonials" replace />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={
            <>
              <span className="text-gradient">Client Portfolio</span> Details
            </>
          }
          breadcrumbs={CLIENT_PORTFOLIO_DETAIL_HEADER.breadcrumbs}
        />

        {state.status === "loading" && <DetailSkeleton />}

        {state.status === "error" && (
          <section className="relative bg-navy pb-16 pt-10">
            <div className="container-narrow surface-card flex flex-col items-center gap-5 px-6 py-12 text-center">
              <p className="font-body text-[15px] text-white/75">We couldn’t load this client. Please try again.</p>
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

        {data && (
          <>
            <ClientPortfolioHero data={data.hero} />
            <ClientPortfolioSuccessStory successStory={data.successStory} />
            <SuccessStories id="client-stories" data={{ ...RELATED_SECTIONS.stories, items: data.stories }} />
            <TestimonialsReviews data={{ ...RELATED_SECTIONS.reviews, items: data.reviews }} />
          </>
        )}

        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
