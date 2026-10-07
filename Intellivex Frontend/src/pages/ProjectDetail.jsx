import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ProjectDetailHeaderInfo from "../components/ProjectDetailHeaderInfo";
import ProjectDetailGallery from "../components/ProjectDetailGallery";
import ProjectDetailDescription from "../components/ProjectDetailDescription";
import ProjectDetailNav from "../components/ProjectDetailNav";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { PROJECT_DETAIL_HEADER } from "../data/projectDetail";
import { fetchPortfolioPage, fetchProject, toPortfolioPage, toProjectDetail } from "../services/portfolio";
import { usePageMeta } from "../hooks/usePageMeta";

function DetailSkeleton() {
  return (
    <section className="relative bg-navy pb-16 pt-6 sm:pt-8 lg:pt-10" aria-busy="true" aria-label="Loading project">
      <div className="container-narrow relative animate-pulse">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="mt-4 h-12 max-w-[640px] rounded bg-white/10" />
        <div className="mt-4 h-16 max-w-[920px] rounded bg-white/[0.06]" />
        <div className="mt-10 aspect-[2/1] rounded-[18px] bg-white/[0.06]" />
      </div>
    </section>
  );
}

/**
 * /portfolio/:slug — one published project (GET /api/projects/{slug}).
 * Drafts and unknown slugs (404) go back to /portfolio.
 */
export default function ProjectDetail() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", data: null });
  const [attempt, setAttempt] = useState(0);
  const [cta, setCta] = useState(undefined);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading", data: null });
    fetchProject(slug)
      .then((project) => alive && setState({ status: "ready", data: toProjectDetail(project) }))
      .catch((err) => alive && setState({ status: err?.notFound ? "notFound" : "error", data: null }));
    return () => {
      alive = false;
    };
  }, [slug, attempt]);

  // CTA banner is shared with the Portfolio page; the default banner if that fails.
  useEffect(() => {
    let alive = true;
    fetchPortfolioPage()
      .then((page) => alive && setCta(toPortfolioPage(page).cta))
      .catch(() => alive && setCta(undefined));
    return () => {
      alive = false;
    };
  }, []);

  usePageMeta(state.data?.seo.title, state.data?.seo.description);

  if (state.status === "notFound") return <Navigate to="/portfolio" replace />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={
            <>
              <span className="text-gradient">Project</span> Details
            </>
          }
          breadcrumbs={PROJECT_DETAIL_HEADER.breadcrumbs}
        />

        {state.status === "loading" && <DetailSkeleton />}

        {state.status === "error" && (
          <section className="relative bg-navy pb-16 pt-10">
            <div className="container-narrow surface-card flex flex-col items-center gap-5 px-6 py-12 text-center">
              <p className="font-body text-[15px] text-white/75">We couldn’t load this project. Please try again.</p>
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

        {state.status === "ready" && (
          <>
            <ProjectDetailHeaderInfo data={state.data} />
            <ProjectDetailGallery data={state.data} />
            <ProjectDetailDescription data={state.data} />
            <ProjectDetailNav data={state.data} />
          </>
        )}

        {cta === undefined ? <CTABanner /> : cta && <CTABanner content={cta} />}
      </main>
      <Footer />
    </div>
  );
}
