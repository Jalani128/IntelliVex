import { useState } from "react";
import Eyebrow from "./Eyebrow";
import ProjectCard from "./ProjectCard";
import DecorSquares from "./DecorSquares";
import Reveal from "./Reveal";
import { PORTFOLIO_RECENT_PROJECTS } from "../data/portfolio";

const GRID_SHAPES = [
  { className: "right-[3%] top-[12%]", size: 82, drift: 15, duration: 11 },
];

export default function PortfolioGrid({ content = PORTFOLIO_RECENT_PROJECTS }) {
  const [loadedMore, setLoadedMore] = useState(false);

  return (
    <section id="portfolio-grid" className="relative overflow-hidden bg-navy pb-16 pt-8 md:pb-20 md:pt-10 lg:pb-[90px] lg:pt-[40px]">
      <DecorSquares shapes={GRID_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        {/* Section Heading matching Figma */}
        <div>
          <Reveal>
            <Eyebrow>{content.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.15] text-white sm:text-[40px] lg:text-[48px]">
              {content.title} <span className="text-gradient">{content.highlight}</span>
            </h2>
          </Reveal>
        </div>

        {/* Project Cards (Stacked) */}
        <div className="mt-10 flex flex-col gap-8 md:gap-10">
          {content.items.map((project, i) => (
            <Reveal key={project.id || i} delay={0.1 * i}>
              <ProjectCard {...project} />
            </Reveal>
          ))}
        </div>

        {/* Centered LOAD MORE button matching Figma screenshot */}
        <div className="mt-12 flex justify-center">
          <Reveal delay={0.2}>
            <button
              type="button"
              onClick={() => setLoadedMore((prev) => !prev)}
              className="cursor-pointer rounded-full border border-white/20 bg-white/[0.04] px-8 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:text-white"
            >
              {loadedMore ? "No More Projects" : "Load More"}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
