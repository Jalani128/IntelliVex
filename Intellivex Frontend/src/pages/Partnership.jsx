import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Eyebrow from "../components/Eyebrow";
import Button from "../components/Button";
import Reveal from "../components/Reveal";
import DecorSquares from "../components/DecorSquares";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import {
  PARTNERSHIP_HEADER,
  PASSION_SECTION,
  STRATEGIC_PARTNERS,
  INTEGRATION_LOGOS,
  TECH_INTEGRATIONS,
  SUPPORTED_PLATFORMS,
  PARTNERSHIP_CTA,
} from "../data/partnership";

const SECTION_SHAPES_1 = [
  { className: "left-[2%] top-[12%]", size: 82, drift: 14, duration: 10, delay: 0.3 },
];

const SECTION_SHAPES_2 = [
  { className: "right-[3%] top-[20%]", size: 82, drift: 15, duration: 11, delay: 0.6 },
];

export default function Partnership() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />

      <main>
        {/* Page Header: Title with gradient accent on "Partner" and breadcrumbs */}
        <PageHeader
          title={
            <>
              <span className="text-gradient">Partner</span>
              <span className="text-white">ships</span>
            </>
          }
          breadcrumbs={PARTNERSHIP_HEADER.breadcrumbs}
        />

        {/* Section 1: Passion and Innovation Shape Our Journey */}
        <section id="passion-journey" className="relative bg-navy pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
          <DecorSquares shapes={SECTION_SHAPES_1} className="hidden lg:block" />

          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{PASSION_SECTION.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 max-w-[800px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {PASSION_SECTION.titleLine1} <br className="hidden sm:inline" />
                <span className="text-gradient">{PASSION_SECTION.highlight}</span>{" "}
                {PASSION_SECTION.titleTail}
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-4 max-w-[780px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px]">
                {PASSION_SECTION.description}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <Button href={PASSION_SECTION.action.href} variant="light" size="sm" className="mt-6">
                {PASSION_SECTION.action.label}
              </Button>
            </Reveal>
          </div>
        </section>

        {/* Section 2: Technology & Strategic Partners */}
        <section id="strategic-partners" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{STRATEGIC_PARTNERS.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {STRATEGIC_PARTNERS.titleLine}{" "}
                <span className="text-gradient">{STRATEGIC_PARTNERS.highlight}</span>
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-4 max-w-[780px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px]">
                {STRATEGIC_PARTNERS.description}
              </p>
            </Reveal>

            {/* 4 Logos Row */}
            <Reveal delay={0.2}>
              <div className="mt-10 grid grid-cols-2 items-center gap-8 sm:grid-cols-4 sm:gap-10 lg:mt-14">
                {STRATEGIC_PARTNERS.logos.map((logo, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center ${
                      idx === 0
                        ? "justify-start"
                        : idx === STRATEGIC_PARTNERS.logos.length - 1
                        ? "justify-end"
                        : "justify-center"
                    }`}
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-7 sm:h-8 lg:h-9 w-auto object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Section 3: Partner / Integration Logos (3x2 Grid) */}
        <section id="integration-logos" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{INTEGRATION_LOGOS.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {INTEGRATION_LOGOS.titleLine}{" "}
                <span className="text-gradient">{INTEGRATION_LOGOS.highlight}</span>
              </h2>
            </Reveal>

            {/* 3x2 Grid matching reference screenshot without outer border */}
            <Reveal delay={0.16}>
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {INTEGRATION_LOGOS.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-center p-8 sm:p-10 lg:p-14 min-h-[140px] sm:min-h-[170px] lg:min-h-[190px] transition-colors duration-300 hover:bg-white/[0.02] ${
                      idx < 3 ? "lg:border-b border-white/10" : ""
                    } ${idx % 3 !== 2 ? "lg:border-r border-white/10" : ""} ${
                      idx < 4 ? "sm:max-lg:border-b border-white/10" : ""
                    } ${idx % 2 === 0 ? "sm:max-lg:border-r border-white/10" : ""} ${
                      idx < 5 ? "max-sm:border-b border-white/10" : ""
                    }`}
                  >
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="h-8 sm:h-9 lg:h-10 w-auto max-w-[160px] object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Section 4: Technology Integrations (Video Player Card) */}
        <section id="tech-integrations" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <DecorSquares shapes={SECTION_SHAPES_2} className="hidden lg:block" />

          <div className="container-narrow relative">
            <Reveal>
              <Eyebrow>{TECH_INTEGRATIONS.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                {TECH_INTEGRATIONS.titleLine}{" "}
                <span className="text-gradient">{TECH_INTEGRATIONS.highlight}</span>
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="relative mx-auto mt-10 w-full max-w-[1059px] overflow-hidden rounded-[22px]">
                <img
                  src={TECH_INTEGRATIONS.videoImage}
                  alt={TECH_INTEGRATIONS.videoAlt}
                  className="w-full h-auto object-contain block"
                />

                {/* Circular Play Button using playicon.png */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    aria-label="Play video"
                    className="group cursor-pointer transition-transform duration-300 ease-out hover:scale-110 active:scale-95 focus:outline-none"
                  >
                    <img
                      src={TECH_INTEGRATIONS.playIcon}
                      alt="Play"
                      className="h-16 w-16 sm:h-20 sm:w-20 md:h-[88px] md:w-[88px] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.5)]"
                    />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Section 5: Platforms & Technologies Supported */}
        <section id="supported-platforms" className="relative bg-navy py-12 sm:py-16 lg:py-20">
          <div className="container-narrow relative">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Reveal>
                  <Eyebrow>{SUPPORTED_PLATFORMS.eyebrow}</Eyebrow>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[42px] lg:text-[50px]">
                    {SUPPORTED_PLATFORMS.titleLine}{" "}
                    <span className="text-gradient">{SUPPORTED_PLATFORMS.highlight}</span>
                  </h2>
                </Reveal>
              </div>

              <Reveal delay={0.14} className="shrink-0 sm:pb-1">
                <Button href={SUPPORTED_PLATFORMS.action.href} variant="light" size="sm">
                  {SUPPORTED_PLATFORMS.action.label}
                </Button>
              </Reveal>
            </div>

            {/* 3 Supported Cards */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
              {SUPPORTED_PLATFORMS.items.map((card, idx) => (
                <Reveal key={idx} delay={0.1 * idx} y={24}>
                  <article className="group relative flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#2b4c9e]/45 bg-[#0e1a47] p-7 sm:p-8 min-h-[260px] transition-all duration-300 hover:border-[#3876ff] hover:shadow-[0_15px_40px_rgba(30,90,255,0.25)]">
                    {/* Glowing top-right ambient bloom matching Figma screenshot */}
                    <div
                      className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-[#1e60ff]/40 blur-2xl transition-all duration-500 group-hover:bg-[#1e60ff]/60 group-hover:scale-125"
                      aria-hidden="true"
                    />

                    <div className="relative z-10">
                      <img
                        src={card.icon}
                        alt=""
                        className="h-8 w-8 sm:h-9 sm:w-9 object-contain mb-8 transition-transform duration-300 group-hover:scale-105"
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

        {/* Section 6: Become a Partner CTA Banner */}
        <CTABanner content={PARTNERSHIP_CTA} />
      </main>

      <Footer />
    </div>
  );
}
