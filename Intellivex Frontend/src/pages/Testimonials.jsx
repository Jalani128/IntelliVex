import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import TestimonialsLogoBar from "../components/TestimonialsLogoBar";
import ClientPortfolio from "../components/ClientPortfolio";
import TestimonialsReviews from "../components/TestimonialsReviews";
import SuccessStories from "../components/SuccessStories";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { TESTIMONIALS_HEADER, SECTION_EYEBROWS, STORY_IMAGE_PLACEHOLDER } from "../data/testimonials";
import { fetchTestimonialsPage, toTestimonialsPage } from "../services/testimonials";
import { usePageMeta } from "../hooks/usePageMeta";

function PageSkeleton() {
  return (
    <section className="relative bg-navy pb-16 pt-6 sm:pt-8" aria-busy="true" aria-label="Loading testimonials">
      <div className="container-narrow relative animate-pulse">
        <div className="flex justify-between gap-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-28 rounded bg-white/10" />
          ))}
        </div>
        <div className="mt-14 h-4 w-32 rounded bg-white/10" />
        <div className="mt-4 h-12 max-w-[520px] rounded bg-white/10" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-card h-[150px] rounded-card sm:h-[170px] lg:h-[190px]" />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * /testimonials — everything from GET /api/testimonials-page: client logo bar,
 * Client Portfolio grid, reviews, success stories, headings, CTA and SEO.
 * Sections without content are left out.
 */
export default function Testimonials() {
  const [state, setState] = useState({ status: "loading", page: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, status: "loading" }));
    fetchTestimonialsPage()
      .then(
        (data) =>
          alive &&
          setState({
            status: "ready",
            page: toTestimonialsPage(data, { eyebrows: SECTION_EYEBROWS, fallbackStoryImage: STORY_IMAGE_PLACEHOLDER }),
          }),
      )
      .catch(() => alive && setState({ status: "error", page: null }));
    return () => {
      alive = false;
    };
  }, [attempt]);

  const page = state.page;
  usePageMeta(page?.seo.title, page?.seo.description);

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={
            <>
              <span className="text-gradient">Testimon</span>ials
            </>
          }
          breadcrumbs={TESTIMONIALS_HEADER.breadcrumbs}
        />

        {state.status === "loading" && <PageSkeleton />}

        {state.status === "error" && (
          <section className="relative bg-navy pb-16 pt-10">
            <div className="container-narrow surface-card flex flex-col items-center gap-5 px-6 py-12 text-center">
              <p className="font-body text-[15px] text-white/75">We couldn’t load this page. Please try again.</p>
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

        {page && (
          <>
            <TestimonialsLogoBar logos={page.logos} />
            <ClientPortfolio data={page.portfolio} />
            <TestimonialsReviews data={page.reviews} />
            <SuccessStories data={page.stories} />
          </>
        )}

        {/* CTA from the CMS, or the site's default banner */}
        {page?.cta ? <CTABanner content={page.cta} /> : <CTABanner />}
      </main>
      <Footer />
    </div>
  );
}
