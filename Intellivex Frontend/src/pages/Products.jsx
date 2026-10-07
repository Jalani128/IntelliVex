import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Eyebrow from "../components/Eyebrow";
import Button from "../components/Button";
import Reveal from "../components/Reveal";
import DecorSquares from "../components/DecorSquares";
import ProjectCard, { ProjectCardSkeleton } from "../components/ProjectCard";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import {
  PRODUCTS_HEADER,
  SECTION_EYEBROWS,
  PRODUCT_IMAGE_PLACEHOLDER,
  INDUSTRY_ICON_FALLBACK,
} from "../data/products";
import { fetchProductsPage, toProductsPage } from "../services/products";
import { usePageMeta } from "../hooks/usePageMeta";

const SECTION_SHAPES_1 = [
  { className: "left-[2%] top-[12%]", size: 82, drift: 14, duration: 10, delay: 0.3 },
];

const SECTION_SHAPES_2 = [
  { className: "right-[3%] top-[20%]", size: 82, drift: 15, duration: 11, delay: 0.6 },
];

const SECTION_PAD = "relative bg-navy py-10 sm:py-14 lg:py-16";
const SECTION_TITLE =
  "mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[40px] lg:text-[46px]";

/* Same pill as the portfolio's Load More, for Retry. */
const PILL_BUTTON =
  "cursor-pointer rounded-full border border-white/20 bg-white/[0.04] px-8 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70 transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:text-white";

/* Eyebrow + two-tone heading shared by every section */
function SectionTitle({ eyebrow, lead, highlight, tail }) {
  return (
    <>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={SECTION_TITLE}>
          {lead} <span className="text-gradient">{highlight}</span>
          {tail && ` ${tail}`}
        </h2>
      </Reveal>
    </>
  );
}

/* Boxed product cards used by Featured Products, the catalog and Product Showcase */
function ProductCardList({ cards }) {
  return (
    <div className="mt-10 space-y-6 sm:mt-12">
      {cards.map((card, idx) => (
        <Reveal key={card.id} delay={0.1 * (idx % 4)} y={24}>
          <ProjectCard {...card} />
        </Reveal>
      ))}
    </div>
  );
}

function PageSkeleton() {
  return (
    <section className={SECTION_PAD} aria-busy="true" aria-label="Loading products">
      <div className="container-narrow relative">
        <div className="animate-pulse">
          <div className="h-4 w-40 rounded bg-white/10" />
          <div className="mt-4 h-12 max-w-[640px] rounded bg-white/10" />
          <div className="mt-4 h-16 max-w-[880px] rounded bg-white/[0.06]" />
        </div>
        <div className="mt-12 space-y-6">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    </section>
  );
}

/**
 * /products — everything from GET /api/products-page. Sections without
 * content (no featured products, no solutions, …) are left out.
 */
export default function Products() {
  const [state, setState] = useState({ status: "loading", page: null });
  const [attempt, setAttempt] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, status: "loading" }));
    fetchProductsPage()
      .then((data) => alive && setState({ status: "ready", page: toProductsPage(data, { fallbackImage: PRODUCT_IMAGE_PLACEHOLDER }) }))
      .catch(() => alive && setState({ status: "error", page: null }));
    return () => {
      alive = false;
    };
  }, [attempt]);

  const page = state.page;
  usePageMeta(page?.seo.title, page?.seo.description);

  const catalog = page
    ? page.categories.products.filter((p) => !activeCategory || p.category === activeCategory)
    : [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />

      <main>
        <PageHeader title={PRODUCTS_HEADER.title} breadcrumbs={PRODUCTS_HEADER.breadcrumbs} gradient />

        {state.status === "loading" && <PageSkeleton />}

        {state.status === "error" && (
          <section className={SECTION_PAD}>
            <div className="container-narrow surface-card flex flex-col items-center gap-5 px-6 py-12 text-center">
              <p className="font-body text-[15px] text-white/75">We couldn’t load the products. Please try again.</p>
              <button type="button" onClick={() => setAttempt((n) => n + 1)} className={PILL_BUTTON}>
                Try Again
              </button>
            </div>
          </section>
        )}

        {page && (
          <>
            {/* Section 1: Overview */}
            <section id="products-overview" className={SECTION_PAD}>
              <DecorSquares shapes={SECTION_SHAPES_1} className="hidden lg:block" />

              <div className="container-narrow relative">
                <Reveal>
                  <Eyebrow>{page.overview.eyebrow}</Eyebrow>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className={`${SECTION_TITLE} max-w-[800px]`}>
                    {page.overview.lead} {page.overview.highlight && <br className="hidden sm:inline" />}
                    <span className="text-gradient">{page.overview.highlight}</span>
                    {page.overview.tail && ` ${page.overview.tail}`}
                  </h2>
                </Reveal>

                {page.overview.description && (
                  <Reveal delay={0.14}>
                    <p className="mt-4 max-w-[880px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px]">
                      {page.overview.description}
                    </p>
                  </Reveal>
                )}
              </div>
            </section>

            {/* Section 2: Featured Products */}
            {page.featured.cards.length > 0 && (
              <section id="featured-products" className={SECTION_PAD}>
                <div className="container-narrow relative">
                  <SectionTitle eyebrow={SECTION_EYEBROWS.featured} {...page.featured} />
                  <ProductCardList cards={page.featured.cards} />
                </div>
              </section>
            )}

            {/* Section 3: Solution Categories — the pills filter the full product list */}
            <section id="solution-categories" className={SECTION_PAD}>
              <div className="container-narrow relative">
                <SectionTitle eyebrow={SECTION_EYEBROWS.categories} {...page.categories} />

                {page.categories.pills.length > 0 && (
                  <Reveal delay={0.2}>
                    <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
                      {page.categories.pills.map((cat) => {
                        const isActive = activeCategory === cat.slug;
                        return (
                          <button
                            key={cat.slug}
                            type="button"
                            aria-pressed={isActive}
                            // Clicking the active pill again shows every product.
                            onClick={() => setActiveCategory(isActive ? null : cat.slug)}
                            className={`cursor-pointer rounded-btn px-4 py-2 font-body text-[12px] font-medium transition-all duration-300 ${
                              isActive
                                ? "bg-accent text-white shadow-[0_4px_16px_rgba(48,118,255,0.4)]"
                                : "border border-white/20 text-white/80 hover:border-white/50 hover:text-white"
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </Reveal>
                )}

                <div id="all-products" aria-live="polite">
                  {catalog.length > 0 ? (
                    <ProductCardList cards={catalog} />
                  ) : (
                    <p className="surface-card mt-10 px-6 py-12 text-center font-body text-[15px] text-white/70 sm:mt-12">
                      {activeCategory ? "No products in this category yet." : "No products to show yet — check back soon."}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Section 4: Ready-to-Deploy / Customizable Solutions */}
            {page.deployable.items.length > 0 && (
              <section id="customizable-solutions" className={SECTION_PAD}>
                <DecorSquares shapes={SECTION_SHAPES_2} className="hidden lg:block" />

                <div className="container-narrow relative">
                  <SectionTitle eyebrow={SECTION_EYEBROWS.deployable} {...page.deployable} />

                  <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
                    {page.deployable.items.map((card, idx) => (
                      <Reveal key={card.id} delay={0.1 * idx} y={24} className="h-full">
                        <article className="surface-card group relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden p-6 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-accent/50 hover:shadow-[0_24px_50px_-20px_rgba(6,86,243,0.55)] sm:p-7">
                          {/* Blue bloom spilling from the top-left, as in the design */}
                          <div
                            className="pointer-events-none absolute -left-10 -top-16 h-48 w-48 rounded-full bg-accent/45 opacity-80 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                            aria-hidden="true"
                          />

                          {card.icon ? (
                            <img
                              src={card.icon}
                              alt=""
                              className="relative h-8 w-8 object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <span className="relative h-8 w-8" aria-hidden="true" />
                          )}

                          <div className="relative mt-12">
                            <h3 className="font-display text-[20px] font-medium text-white">
                              {card.title}
                            </h3>
                            <p className="mt-2.5 font-body text-[13px] leading-[1.6] text-white/70">
                              {card.description}
                            </p>
                            {card.href && (
                              <Button
                                href={card.href}
                                variant="ghost"
                                size="none"
                                className="mt-5"
                                {...(card.external && { target: "_blank", rel: "noopener noreferrer" })}
                              >
                                {page.deployable.buttonLabel}
                              </Button>
                            )}
                          </div>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Section 5: Industries / Use Cases */}
            {page.useCases.items.length > 0 && (
              <section id="industries-use-cases" className={SECTION_PAD}>
                <div className="container-narrow relative">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <SectionTitle eyebrow={SECTION_EYEBROWS.useCases} {...page.useCases} />
                    </div>

                    <Reveal delay={0.14} className="shrink-0 sm:pb-2">
                      <Button href="/industries" variant="light" size="sm">
                        {page.useCases.viewAllLabel}
                      </Button>
                    </Reveal>
                  </div>

                  <div className="mt-10 space-y-5 sm:mt-12">
                    {page.useCases.items.map((card, idx) => (
                      <Reveal key={card.id} delay={0.1 * idx} y={20}>
                        <article className="surface-card group relative overflow-hidden px-6 py-8 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-accent/50 hover:shadow-[0_24px_50px_-20px_rgba(6,86,243,0.55)] sm:px-10 lg:py-10">
                          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
                            <div className="flex shrink-0 items-center gap-8 lg:w-[360px] lg:gap-16">
                              <img
                                src={card.icon || INDUSTRY_ICON_FALLBACK}
                                alt=""
                                className="h-12 w-12 shrink-0 object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
                              />
                              <h3 className="font-display text-[20px] font-medium text-white">
                                {card.title}
                              </h3>
                            </div>

                            <p className="max-w-[360px] flex-1 font-body text-[13px] leading-[1.6] text-white/70">
                              {card.description}
                            </p>

                            <Button
                              href={card.href}
                              variant="primary"
                              size="sm"
                              className="shrink-0 self-start lg:ml-auto lg:self-center"
                            >
                              {page.useCases.buttonLabel}
                            </Button>
                          </div>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Section 6: Product Showcase */}
            {page.showcase.cards.length > 0 && (
              <section id="product-showcase" className={SECTION_PAD}>
                <div className="container-narrow relative">
                  <SectionTitle eyebrow={SECTION_EYEBROWS.showcase} {...page.showcase} />
                  <ProductCardList cards={page.showcase.cards} />
                </div>
              </section>
            )}
          </>
        )}

        {/* Section 7: CTA Banner — from the CMS, or the site's default banner */}
        {page?.cta ? <CTABanner content={page.cta} /> : <CTABanner />}
      </main>

      <Footer />
    </div>
  );
}
