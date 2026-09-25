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
  INDUSTRIES_OVERVIEW,
  INDUSTRIES_SERVE,
  FEATURED_PROJECTS,
  INDUSTRIES_CTA,
} from "../data/industries";

const SECTION_SHAPES_1 = [
  { className: "left-[2%] top-[12%]", size: 82, drift: 14, duration: 10, delay: 0.3 },
];

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
          <div>
            <span className="inline-block rounded-full bg-[#1e60ff] px-4 py-1 font-display text-[11.5px] font-semibold text-white shadow-[0_4px_16px_rgba(30,96,255,0.4)]">
              {card.badge}
            </span>
          </div>

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
            className="block h-auto w-full object-contain"
          />
        </div>
      </article>
    </Reveal>
  );
}

export default function Industries() {
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

        {/* Section 1: Overview (Empowering Industries for Tomorrow Success) */}
        <section
          id="industries-overview"
          className="relative bg-navy pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16"
        >
          <DecorSquares shapes={SECTION_SHAPES_1} className="hidden lg:block" />

          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{INDUSTRIES_OVERVIEW.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 max-w-[800px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {INDUSTRIES_OVERVIEW.titleLine1} <br className="hidden sm:inline" />
                <span className="text-gradient">{INDUSTRIES_OVERVIEW.highlight}</span>{" "}
                {INDUSTRIES_OVERVIEW.titleTail}
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-4 max-w-[780px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px]">
                {INDUSTRIES_OVERVIEW.description}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Section 2: Industries We Serve */}
        <section id="industries-we-serve" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{INDUSTRIES_SERVE.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {INDUSTRIES_SERVE.titleLine1}{" "}
                <span className="text-gradient">{INDUSTRIES_SERVE.highlight}</span>{" "}
                {INDUSTRIES_SERVE.titleTail}
              </h2>
            </Reveal>

            {/* 4 Wide Horizontal Cards */}
            <div className="mt-10 space-y-6 sm:mt-12">
              {INDUSTRIES_SERVE.items.map((card, idx) => (
                <Reveal key={card.id} delay={0.08 * idx} y={20}>
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

                      {/* Right: DISCOVER button */}
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
          </div>
        </section>

        {/* Section 3: Featured Projects */}
        <section id="featured-projects" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <div className="container-narrow relative">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Reveal>
                  <Eyebrow>{FEATURED_PROJECTS.eyebrow}</Eyebrow>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                    {FEATURED_PROJECTS.titleLine}{" "}
                    <span className="text-gradient">{FEATURED_PROJECTS.highlight}</span>
                  </h2>
                </Reveal>
              </div>

              <Reveal delay={0.14} className="shrink-0 sm:pb-1">
                <Button href={FEATURED_PROJECTS.action.href} variant="light" size="sm">
                  {FEATURED_PROJECTS.action.label}
                </Button>
              </Reveal>
            </div>

            {/* 2 Project Cards with subtle divider */}
            <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
              {FEATURED_PROJECTS.cards.map((card, idx) => (
                <div key={card.id}>
                  {idx > 0 && <div className="mb-12 h-px w-full bg-white/10 sm:mb-16" />}
                  <ProjectCard card={card} delay={0.1 * idx} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: CTA Banner */}
        <CTABanner content={INDUSTRIES_CTA} />
      </main>

      <Footer />
    </div>
  );
}
