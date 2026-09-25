import { useState } from "react";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import { PORTFOLIO_BEST_FEATURES } from "../data/portfolio";

const OVERVIEW_SHAPES = [
  { className: "left-[3%] bottom-[12%]", size: 82, drift: 14, duration: 10, delay: 0.4 },
];

export default function PortfolioOverview() {
  const [activePill, setActivePill] = useState(PORTFOLIO_BEST_FEATURES.pills[0]);

  return (
    <section
      id="portfolio-overview"
      className="bg-about-glow relative overflow-hidden bg-navy pb-12 pt-6 md:pb-16 md:pt-10 lg:pb-[70px] lg:pt-[56px]"
    >
      <DecorSquares shapes={OVERVIEW_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal y={20}>
          <Eyebrow>{PORTFOLIO_BEST_FEATURES.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-3.5 max-w-[940px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[40px] lg:text-[48px]">
            {PORTFOLIO_BEST_FEATURES.titleLine}{" "}
            <span className="text-gradient">{PORTFOLIO_BEST_FEATURES.highlight}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-4 max-w-[880px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]">
            {PORTFOLIO_BEST_FEATURES.description}
          </p>
        </Reveal>

        {/* Category Pills matching Figma screenshot */}
        <Reveal delay={0.24}>
          <div className="mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
            {PORTFOLIO_BEST_FEATURES.pills.map((pill) => {
              const isActive = activePill === pill;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setActivePill(pill)}
                  className={`cursor-pointer rounded-full px-4 py-2 font-body text-[13px] font-medium transition-all duration-300 sm:px-5 sm:py-2.5 ${
                    isActive
                      ? "bg-gradient-to-r from-[#1877F2] to-[#2563EB] text-white shadow-[0_4px_16px_rgba(24,119,242,0.35)]"
                      : "border border-white/15 bg-white/[0.04] text-white/70 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
