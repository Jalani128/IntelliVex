import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ProjectDetailHeaderInfo from "../components/ProjectDetailHeaderInfo";
import ProjectDetailGallery from "../components/ProjectDetailGallery";
import ProjectDetailDescription from "../components/ProjectDetailDescription";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { PRODUCT_DETAIL_HEADER } from "../data/products";
import { fetchProduct, fetchProductsPage, toProductDetail, toProductsPage } from "../services/products";
import { usePageMeta } from "../hooks/usePageMeta";

function DetailSkeleton() {
  return (
    <section className="relative bg-navy pb-16 pt-6 sm:pt-8 lg:pt-10" aria-busy="true" aria-label="Loading product">
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
 * /products/:slug — one published product (GET /api/products/{slug}), laid out
 * with the Project Details sections: intro, image + gallery, "Key Features".
 * Drafts and unknown slugs (404) go back to /products.
 */
export default function ProductDetail() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", product: null });
  const [attempt, setAttempt] = useState(0);
  // Button labels and CTA banner are shared with the Products page.
  const [page, setPage] = useState(undefined);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading", product: null });
    fetchProduct(slug)
      .then((product) => alive && setState({ status: "ready", product }))
      .catch((err) => alive && setState({ status: err?.notFound ? "notFound" : "error", product: null }));
    return () => {
      alive = false;
    };
  }, [slug, attempt]);

  useEffect(() => {
    let alive = true;
    fetchProductsPage()
      .then((data) => alive && setPage({ demoLabel: data.content?.demo_button_label, cta: toProductsPage(data).cta }))
      .catch(() => alive && setPage(null));
    return () => {
      alive = false;
    };
  }, []);

  const data = state.product ? toProductDetail(state.product, { demoLabel: page?.demoLabel }) : null;
  usePageMeta(data?.seo.title, data?.seo.description);

  if (state.status === "notFound") return <Navigate to="/products" replace />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={
            <>
              <span className="text-gradient">Product</span> Details
            </>
          }
          breadcrumbs={PRODUCT_DETAIL_HEADER.breadcrumbs}
        />

        {state.status === "loading" && <DetailSkeleton />}

        {state.status === "error" && (
          <section className="relative bg-navy pb-16 pt-10">
            <div className="container-narrow surface-card flex flex-col items-center gap-5 px-6 py-12 text-center">
              <p className="font-body text-[15px] text-white/75">We couldn’t load this product. Please try again.</p>
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
            <ProjectDetailHeaderInfo data={data} />
            <ProjectDetailGallery data={data} />
            <ProjectDetailDescription data={data} />
          </>
        )}

        {page?.cta ? <CTABanner content={page.cta} /> : <CTABanner />}
      </main>
      <Footer />
    </div>
  );
}
