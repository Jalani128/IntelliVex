import Eyebrow from "./Eyebrow";
import ProjectCard, { ProjectCardSkeleton } from "./ProjectCard";
import DecorSquares from "./DecorSquares";
import Reveal from "./Reveal";

const GRID_SHAPES = [
  { className: "right-[3%] top-[12%]", size: 82, drift: 15, duration: 11 },
];

/* Same pill as the Load More button, for Retry. */
const PILL_BUTTON =
  "cursor-pointer rounded-full border border-white/20 bg-white/[0.04] px-8 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:text-white disabled:cursor-wait disabled:opacity-60";

/**
 * "Recent Projects" list on /portfolio.
 * @param content  { eyebrow, lead, highlight, tail, description } — null while loading
 * @param list     useProjectList() state: items (card props), status, hasMore, loadMore, retry
 */
export default function PortfolioGrid({ content, list, loadMoreLabel = "Load More", filtered = false }) {
  const { items, status, hasMore, loadMore, retry } = list;

  return (
    <section id="portfolio-grid" className="relative overflow-hidden bg-navy pb-16 pt-8 md:pb-20 md:pt-10 lg:pb-[90px] lg:pt-[40px]">
      <DecorSquares shapes={GRID_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        {/* Section Heading matching Figma */}
        {content && (
          <div>
            <Reveal>
              <Eyebrow>{content.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-3.5 font-display text-[32px] font-medium leading-[1.15] text-white sm:text-[40px] lg:text-[48px]">
                {content.lead} <span className="text-gradient">{content.highlight}</span>
                {content.tail && ` ${content.tail}`}
              </h2>
            </Reveal>

            {content.description && (
              <Reveal delay={0.12}>
                <p className="mt-4 max-w-[880px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]">
                  {content.description}
                </p>
              </Reveal>
            )}
          </div>
        )}

        {/* Project Cards (Stacked) */}
        <div className="mt-10 flex flex-col gap-8 md:gap-10" aria-live="polite" aria-busy={status === "loading"}>
          {status === "loading" && [0, 1].map((i) => <ProjectCardSkeleton key={i} />)}

          {status === "error" && (
            <div className="surface-card flex flex-col items-center gap-5 px-6 py-12 text-center">
              <p className="font-body text-[15px] text-white/75">We couldn’t load the projects. Please try again.</p>
              <button type="button" onClick={retry} className={PILL_BUTTON}>
                Try Again
              </button>
            </div>
          )}

          {status !== "loading" && status !== "error" && items.length === 0 && (
            <p className="surface-card px-6 py-12 text-center font-body text-[15px] text-white/70">
              {filtered ? "No projects in this category yet." : "No projects to show yet — check back soon."}
            </p>
          )}

          {status !== "loading" &&
            status !== "error" &&
            items.map((project, i) => (
              <Reveal key={project.id ?? i} delay={0.1 * (i % 4)}>
                <ProjectCard {...project} />
              </Reveal>
            ))}
        </div>

        {/* Centered LOAD MORE button matching Figma screenshot */}
        {(hasMore || status === "loadingMore") && (
          <div className="mt-12 flex justify-center">
            <button type="button" onClick={loadMore} disabled={status === "loadingMore"} className={PILL_BUTTON}>
              {status === "loadingMore" ? "Loading…" : loadMoreLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
