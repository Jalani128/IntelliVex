import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Eyebrow from "../components/Eyebrow";
import Button from "../components/Button";
import SiteLink from "../components/SiteLink";
import Reveal from "../components/Reveal";
import DecorSquares from "../components/DecorSquares";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import {
  INDUSTRIES_HEADER,
  SECTION_EYEBROWS,
  FEATURED_PROJECTS,
  INDUSTRY_ICON_FALLBACK,
} from "../data/industries";
import { PROJECT_IMAGE_PLACEHOLDER } from "../data/portfolio";
import { fetchIndustriesPage, toIndustriesPage } from "../services/industries";
import { usePageMeta } from "../hooks/usePageMeta";

const SECTION_SHAPES_1 = [
  { className: "left-[2%] top-[12%]", size: 82, drift: 14, duration: 10, delay: 0.3 },
];

const SECTION_TITLE =
  "mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]";
const SECTION_TEXT =
  "mt-4 max-w-[780px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px]";

/* Reusable Project Card for Section 3 */
function ProjectCard({ card, delay = 0 }) {
  return (
    <Reveal delay={delay} y={24}>
      <article className="group relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        {/* Subtle ambient bloom matching Figma card depth */}
        <div
          className="pointer-events-none absolute -left-8 -top-8 h-44 w-44 rounded-full bg-[#1e60ff]/15 blur-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* Left info column */}
        <div className="relative z-10 flex flex-col justify-center">
          {card.badge && (
          <div>
            <span className="inline-block rounded-full bg-[#1e60ff] px-4 py-1 font-display text-[11.5px] font-semibold text-white shadow-[0_4px_16px_rgba(30,96,255,0.4)]">
              {card.badge}
            </span>
          </div>
          )}

          <h3 className="mt-4 font-display text-[26px] font-medium text-white sm:text-[32px] lg:text-[36px]">
            {card.title}
          </h3>

          <p className="mt-3 max-w-[420px] font-body text-[14px] leading-[1.7] text-white/70 sm:text-[14.5px]">
            {card.description}
          </p>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {card.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1 font-body text-xs text-white/80 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Link */}
          <div className="mt-7 sm:mt-8">
            <SiteLink
              href={card.action.href}
              className="group/btn inline-flex items-center gap-2 font-display text-xs font-semibold tracking-wider text-white transition-all duration-300 hover:text-accent-soft"
            >
              <span>{card.action.label}</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              >
                ➔
              </span>
            </SiteLink>
          </div>
        </div>

        {/* Right mockup column */}
        <div className="overflow-hidden rounded-[16px] border border-white/10 bg-[#0d163d] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-[1.015] sm:rounded-[20px]">
          <img
            src={card.image}
            alt={card.imageAlt}
            onError={(e) => {
              if (card.fallbackImage && e.currentTarget.getAttribute("src") !== card.fallbackImage) e.currentTarget.src = card.fallbackImage;
            }}
            className="block h-auto w-full object-contain"
          />
        </div>
      </article>
    </Reveal>
  );
}

/* Placeholder with the sections' shape while the page loads. */
function PageSkeleton() {
  return (
    <section className="relative bg-navy pb-16 pt-10 sm:pt-14 lg:pt-16" aria-busy="true" aria-label="Loading industries">
      <div className="container-narrow relative animate-pulse">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="mt-4 h-14 max-w-[640px] rounded bg-white/10" />
        <div className="mt-4 h-12 max-w-[780px] rounded bg-white/[0.06]" />
        <div className="mt-16 space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-[18px] border border-[#2b4c9e]/45 bg-[#0e1a47]" />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * /industries — everything from GET /api/industries-page: section headings,
 * published industry cards, featured portfolio projects, CTA and SEO.
 */
export default function Industries() {
  const [state, setState] = useState({ status: "loading", page: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, status: "loading" }));
    fetchIndustriesPage()
      .then(
        (data) =>
          alive &&
          setState({
            status: "ready",
            page: toIndustriesPage(data, {
              fallbackIcon: INDUSTRY_ICON_FALLBACK,
              fallbackImage: PROJECT_IMAGE_PLACEHOLDER,
              projectActionLabel: FEATURED_PROJECTS.cardActionLabel,
            }),
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
        {/* Page Header: Title with gradient accent on "Indust" and breadcrumbs */}
        <PageHeader
          title={
            <>
              <span className="text-gradient">Indust</span>
              <span className="text-white">ries</span>
            </>
          }
          breadcrumbs={INDUSTRIES_HEADER.breadcrumbs}
        />

        {state.status === "loading" && <PageSkeleton />}

        {state.status === "error" && (
          <section className="relative bg-navy py-12 sm:py-16">
            <div className="container-narrow surface-card flex flex-col items-center gap-5 px-6 py-12 text-center">
              <p className="font-body text-[15px] text-white/75">We couldn’t load the industries. Please try again.</p>
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
            {/* Section 1: Overview */}
            <section
              id="industries-overview"
              className="relative bg-navy pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16"
            >
              <DecorSquares shapes={SECTION_SHAPES_1} className="hidden lg:block" />

              <div className="container-narrow relative">
                <Reveal>
                  <Eyebrow>{SECTION_EYEBROWS.overview}</Eyebrow>
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
                    <p className={SECTION_TEXT}>{page.overview.description}</p>
                  </Reveal>
                )}
              </div>
            </section>

            {/* Section 2: Industries We Serve */}
            <section id="industries-we-serve" className="relative bg-navy py-12 sm:py-16 lg:py-20">
              <div className="container-narrow relative">
                <Reveal>
                  <Eyebrow>{SECTION_EYEBROWS.industries}</Eyebrow>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className={SECTION_TITLE}>
                    {page.industries.lead} <span className="text-gradient">{page.industries.highlight}</span>
                    {page.industries.tail && ` ${page.industries.tail}`}
                  </h2>
                </Reveal>

                {page.industries.description && (
                  <Reveal delay={0.12}>
                    <p className={SECTION_TEXT}>{page.industries.description}</p>
                  </Reveal>
                )}

                {/* Wide Horizontal Cards */}
                {page.industries.items.length === 0 ? (
                  <p className="surface-card mt-10 px-6 py-12 text-center font-body text-[15px] text-white/70 sm:mt-12">
                    No industries to show yet — check back soon.
                  </p>
                ) : (
                  <div className="mt-10 space-y-6 sm:mt-12">
                    {page.industries.items.map((card, idx) => (
                      <Reveal key={card.id} delay={0.08 * (idx % 6)} y={20}>
                        <article className="group relative overflow-hidden rounded-[18px] border border-[#2b4c9e]/45 bg-[#0e1a47] p-6 transition-all duration-300 hover:border-[#3876ff] hover:shadow-[0_15px_40px_rgba(30,90,255,0.25)] sm:p-8">
                          {/* Glowing top-right ambient bloom */}
                          <div
                            className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-[#1e60ff]/35 blur-2xl transition-all duration-500 group-hover:bg-[#1e60ff]/55"
                            aria-hidden="true"
                          />

                          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                            {/* Left: Icon and Title */}
                            <div className="flex items-center gap-5 sm:gap-7 shrink-0 lg:w-[280px]">
                              <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shrink-0">
                                <img
                                  src={card.icon}
                                  alt=""
                                  onError={(e) => {
                                    if (e.currentTarget.getAttribute("src") !== INDUSTRY_ICON_FALLBACK) e.currentTarget.src = INDUSTRY_ICON_FALLBACK;
                                  }}
                                  className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
                                />
                              </div>

                              <h3 className="font-display text-[20px] sm:text-[22px] font-medium text-white">
                                {card.title}
                              </h3>
                            </div>

                            {/* Vertical divider on desktop */}
                            <div className="hidden lg:block h-12 w-px bg-white/15 shrink-0" />

                            {/* Middle: Description paragraph */}
                            <p className="max-w-[480px] font-body text-[13.5px] leading-[1.65] text-white/70 lg:px-4">
                              {card.description}
                            </p>

                            {/* Right: card button */}
                            <SiteLink
                              href={card.action.href}
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1e60ff] px-6 py-2.5 font-display text-xs font-semibold tracking-wider text-white shadow-[0_4px_18px_rgba(30,96,255,0.4)] transition-all duration-300 hover:bg-[#3271ff] hover:shadow-[0_4px_22px_rgba(30,96,255,0.6)] shrink-0 self-start lg:self-center"
                            >
                              <span>{card.action.label}</span>
                              <span aria-hidden="true">➔</span>
                            </SiteLink>
                          </div>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Section 3: Featured Projects */}
            {page.featuredProjects.cards.length > 0 && (
            <section id="featured-projects" className="relative bg-navy py-12 sm:py-16 lg:py-20">
              <div className="container-narrow relative">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <Reveal>
                      <Eyebrow>{SECTION_EYEBROWS.featuredProjects}</Eyebrow>
                    </Reveal>

                    <Reveal delay={0.08}>
                      <h2 className={SECTION_TITLE}>
                        {page.featuredProjects.lead} <span className="text-gradient">{page.featuredProjects.highlight}</span>
                        {page.featuredProjects.tail && ` ${page.featuredProjects.tail}`}
                      </h2>
                    </Reveal>

                    {page.featuredProjects.description && (
                      <Reveal delay={0.12}>
                        <p className={SECTION_TEXT}>{page.featuredProjects.description}</p>
                      </Reveal>
                    )}
                  </div>

                  <Reveal delay={0.14} className="shrink-0 sm:pb-1">
                    <Button href={FEATURED_PROJECTS.action.href} variant="light" size="sm">
                      {FEATURED_PROJECTS.action.label}
                    </Button>
                  </Reveal>
                </div>

                {/* Project Cards with subtle divider */}
                <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
                  {page.featuredProjects.cards.map((card, idx) => (
                    <div key={card.id}>
                      {idx > 0 && <div className="mb-12 h-px w-full bg-white/10 sm:mb-16" />}
                      <ProjectCard card={card} delay={0.1 * idx} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
            )}
          </>
        )}

        {/* Section 4: CTA Banner — from the CMS, or the site's default banner */}
        {page?.cta ? <CTABanner content={page.cta} /> : <CTABanner />}
      </main>

      <Footer />
    </div>
  );
}
