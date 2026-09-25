import { useState } from "react";
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
  PRODUCTS_HEADER,
  PRODUCTS_OVERVIEW,
  FEATURED_PRODUCTS,
  SOLUTION_CATEGORIES,
  CUSTOMIZABLE_SOLUTIONS,
  INDUSTRIES_USE_CASES,
  PRODUCT_SHOWCASE,
  PRODUCTS_CTA,
} from "../data/products";

const SECTION_SHAPES_1 = [
  { className: "left-[2%] top-[12%]", size: 82, drift: 14, duration: 10, delay: 0.3 },
];

const SECTION_SHAPES_2 = [
  { className: "right-[3%] top-[20%]", size: 82, drift: 15, duration: 11, delay: 0.6 },
];

/* Reusable Product Showcase Card for Section 2 and Section 6 */
function ProductCard({ card, delay = 0 }) {
  return (
    <Reveal delay={delay} y={24}>
      <article className="group relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        {/* Subtle ambient bloom matching Figma card depth */}
        <div
          className="pointer-events-none absolute -left-8 -top-8 h-44 w-44 rounded-full bg-[#1e60ff]/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-70"
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

        {/* Right browser mockup column */}
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

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("Software Development");

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />

      <main>
        {/* Page Header: Title with gradient accent on "Pro" and breadcrumbs */}
        <PageHeader
          title={
            <>
              <span className="text-gradient">Pro</span>
              <span className="text-white">ducts</span>
            </>
          }
          breadcrumbs={PRODUCTS_HEADER.breadcrumbs}
        />

        {/* Section 1: Overview (Innovative and modern IT Products & solutions) */}
        <section
          id="products-overview"
          className="relative bg-navy pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16"
        >
          <DecorSquares shapes={SECTION_SHAPES_1} className="hidden lg:block" />

          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{PRODUCTS_OVERVIEW.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 max-w-[800px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {PRODUCTS_OVERVIEW.titleLine1} <br className="hidden sm:inline" />
                <span className="text-gradient">{PRODUCTS_OVERVIEW.highlight}</span>{" "}
                {PRODUCTS_OVERVIEW.titleTail}
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-4 max-w-[780px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px]">
                {PRODUCTS_OVERVIEW.description}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Section 2: Featured Products */}
        <section id="featured-products" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{FEATURED_PRODUCTS.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {FEATURED_PRODUCTS.titleLine}{" "}
                <span className="text-gradient">{FEATURED_PRODUCTS.highlight}</span>
              </h2>
            </Reveal>

            {/* 2 Product Cards with subtle divider */}
            <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
              {FEATURED_PRODUCTS.cards.map((card, idx) => (
                <div key={card.id}>
                  {idx > 0 && <div className="mb-12 h-px w-full bg-white/10 sm:mb-16" />}
                  <ProductCard card={card} delay={0.1 * idx} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Solution Categories */}
        <section id="solution-categories" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{SOLUTION_CATEGORIES.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {SOLUTION_CATEGORIES.titleLine}{" "}
                <span className="text-gradient">{SOLUTION_CATEGORIES.highlight}</span>
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-4 max-w-[780px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px]">
                {SOLUTION_CATEGORIES.description}
              </p>
            </Reveal>

            {/* Interactive Category Filter Pills */}
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                {SOLUTION_CATEGORIES.categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-full px-5 py-2.5 font-body text-xs font-medium transition-all duration-300 sm:text-sm ${
                        isActive
                          ? "bg-[#1e60ff] text-white shadow-[0_4px_20px_rgba(30,96,255,0.45)]"
                          : "border border-white/20 bg-transparent text-white/80 hover:border-white/50 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Section 4: Ready-to-Deploy / Customizable Solutions */}
        <section id="customizable-solutions" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <DecorSquares shapes={SECTION_SHAPES_2} className="hidden lg:block" />

          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{CUSTOMIZABLE_SOLUTIONS.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {CUSTOMIZABLE_SOLUTIONS.titleLine}{" "}
                <span className="text-gradient">{CUSTOMIZABLE_SOLUTIONS.highlight}</span>
              </h2>
            </Reveal>

            {/* 3 Supported Cards */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
              {CUSTOMIZABLE_SOLUTIONS.items.map((card, idx) => (
                <Reveal key={idx} delay={0.1 * idx} y={24}>
                  <article className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[18px] border border-[#2b4c9e]/45 bg-[#0e1a47] p-7 transition-all duration-300 hover:border-[#3876ff] hover:shadow-[0_15px_40px_rgba(30,90,255,0.25)] sm:p-8">
                    {/* Glowing top-right ambient bloom */}
                    <div
                      className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-[#1e60ff]/40 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-[#1e60ff]/60"
                      aria-hidden="true"
                    />

                    <div className="relative z-10">
                      <img
                        src={card.icon}
                        alt=""
                        className="mb-8 h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9"
                      />

                      <h3 className="font-display text-[20px] font-medium text-white sm:text-[22px]">
                        {card.title}
                      </h3>

                      <p className="mt-3 font-body text-[13.5px] leading-[1.65] text-white/70">
                        {card.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Industries / Use Cases */}
        <section id="industries-use-cases" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <div className="container-narrow relative">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Reveal>
                  <Eyebrow>{INDUSTRIES_USE_CASES.eyebrow}</Eyebrow>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                    {INDUSTRIES_USE_CASES.titleLine}{" "}
                    <span className="text-gradient">{INDUSTRIES_USE_CASES.highlight}</span>
                  </h2>
                </Reveal>
              </div>

              <Reveal delay={0.14} className="shrink-0 sm:pb-1">
                <Button href={INDUSTRIES_USE_CASES.action.href} variant="light" size="sm">
                  {INDUSTRIES_USE_CASES.action.label}
                </Button>
              </Reveal>
            </div>

            {/* 2 Wide Horizontal Cards */}
            <div className="mt-10 space-y-6 sm:mt-12">
              {INDUSTRIES_USE_CASES.items.map((card, idx) => (
                <Reveal key={card.id} delay={0.1 * idx} y={20}>
                  <article className="group relative overflow-hidden rounded-[18px] border border-[#2b4c9e]/45 bg-[#0e1a47] p-6 transition-all duration-300 hover:border-[#3876ff] hover:shadow-[0_15px_40px_rgba(30,90,255,0.25)] sm:p-8">
                    {/* Glowing top-right ambient bloom */}
                    <div
                      className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-[#1e60ff]/35 blur-2xl transition-all duration-500 group-hover:bg-[#1e60ff]/55"
                      aria-hidden="true"
                    />

                    <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                      {/* Left: Icon and Title */}
                      <div className="flex items-center gap-5 sm:gap-7 shrink-0 lg:w-[260px]">
                        <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shrink-0">
                          <img
                            src={card.icon}
                            alt=""
                            className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
                          />
                        </div>

                        <h3 className="font-display text-[20px] font-medium text-white sm:text-[22px]">
                          {card.title}
                        </h3>
                      </div>

                      {/* Middle: Description paragraph */}
                      <p className="max-w-[480px] font-body text-[13.5px] leading-[1.65] text-white/70 lg:px-4">
                        {card.description}
                      </p>

                      {/* Right: READ MORE button */}
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

        {/* Section 6: Product Showcase */}
        <section id="product-showcase" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{PRODUCT_SHOWCASE.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {PRODUCT_SHOWCASE.titleLine}{" "}
                <span className="text-gradient">{PRODUCT_SHOWCASE.highlight}</span>
              </h2>
            </Reveal>

            {/* 2 Product Cards with subtle divider */}
            <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
              {PRODUCT_SHOWCASE.cards.map((card, idx) => (
                <div key={card.id}>
                  {idx > 0 && <div className="mb-12 h-px w-full bg-white/10 sm:mb-16" />}
                  <ProductCard card={card} delay={0.1 * idx} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Become a Partner CTA Banner */}
        <CTABanner content={PRODUCTS_CTA} />
      </main>

      <Footer />
    </div>
  );
}
