import { ArrowRight } from "lucide-react";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import SiteLink from "./SiteLink";
import DecorSquares from "./DecorSquares";

const SHAPES = [
  { className: "right-[3%] top-[20%]", size: 82, drift: 15, duration: 11, delay: 0.4 },
];

/* A story image that fails to load falls back to the placeholder. */
const fallbackTo = (story) => (e) => {
  if (story.fallbackImage && e.currentTarget.getAttribute("src") !== story.fallbackImage) e.currentTarget.src = story.fallbackImage;
};

/**
 * Success Stories — `data`: { eyebrow, lead, highlight, tail, description, featured, items }.
 * Featured stories are the large top row; the rest go in the row below.
 * Left out when there are no stories.
 */
export default function SuccessStories({ data, id = "success-stories" }) {
  const { featured = [], items = [] } = data;
  if (featured.length === 0 && items.length === 0) return null;

  return (
    <section id={id} className="relative bg-navy pb-16 pt-2 sm:pb-20 lg:pb-[90px] lg:pt-4">
      <DecorSquares shapes={SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal y={18}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.08} y={20}>
          <h2 className="mt-3.5 max-w-[940px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[40px] lg:text-[48px]">
            {data.lead} <span className="text-gradient">{data.highlight}</span>
            {data.tail && ` ${data.tail}`}
          </h2>
        </Reveal>

        {data.description && (
          <Reveal delay={0.12} y={16}>
            <p className="mt-4 max-w-[1060px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]">
              {data.description}
            </p>
          </Reveal>
        )}

        {/* Row 1: Large Featured Story Cards */}
        {featured.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {featured.map((story, i) => (
              <Reveal key={story.id || i} delay={0.1 * (i + 1)} y={22}>
                <article className="group flex flex-col">
                  <div className="overflow-hidden rounded-[14px] border border-white/12 bg-white/[0.03] shadow-[0_20px_45px_-18px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-white/25 sm:rounded-[18px]">
                    <img
                      src={story.image}
                      alt={story.title}
                      onError={fallbackTo(story)}
                      className="h-[240px] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105 sm:h-[280px] lg:h-[320px]"
                    />
                  </div>

                  <h3 className="mt-5 font-display text-[20px] font-medium leading-snug text-white transition-colors duration-300 group-hover:text-accent-soft sm:text-[22px]">
                    {story.title}
                  </h3>

                  <SiteLink
                    href={story.href}
                    className="mt-3 inline-flex items-center gap-2 font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-white/80 transition-colors duration-300 hover:text-white"
                  >
                    <span>READ MORE</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </SiteLink>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        {/* Row 2: Secondary Story Cards */}
        {items.length > 0 && (
          <div className={`${featured.length > 0 ? "mt-8 sm:mt-10 lg:mt-12" : "mt-10"} grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8`}>
            {items.map((story, i) => (
              <Reveal key={story.id || i} delay={0.1 * ((i % 3) + 1)} y={20}>
                <article className="group flex flex-col">
                  <div className="overflow-hidden rounded-[12px] border border-white/12 bg-white/[0.03] shadow-[0_16px_36px_-16px_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-white/25 sm:rounded-[16px]">
                    <img
                      src={story.image}
                      alt={story.title}
                      onError={fallbackTo(story)}
                      className="h-[180px] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105 sm:h-[190px] lg:h-[210px]"
                    />
                  </div>

                  <h3 className="mt-4 font-display text-[16px] font-medium leading-snug text-white transition-colors duration-300 group-hover:text-accent-soft sm:text-[18px]">
                    {story.title}
                  </h3>

                  <SiteLink
                    href={story.href}
                    className="mt-2.5 inline-flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-white/75 transition-colors duration-300 hover:text-white"
                  >
                    <span>READ MORE</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </SiteLink>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
