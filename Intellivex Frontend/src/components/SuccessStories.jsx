import { ArrowRight } from "lucide-react";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import SiteLink from "./SiteLink";
import DecorSquares from "./DecorSquares";
import { SUCCESS_STORIES_DATA } from "../data/testimonials";

const SHAPES = [
  { className: "right-[3%] top-[20%]", size: 82, drift: 15, duration: 11, delay: 0.4 },
];

export default function SuccessStories({ data = SUCCESS_STORIES_DATA }) {
  const { featured, items } = data;

  return (
    <section id="success-stories" className="relative bg-navy pb-16 pt-2 sm:pb-20 lg:pb-[90px] lg:pt-4">
      <DecorSquares shapes={SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal y={18}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.08} y={20}>
          <h2 className="mt-3.5 max-w-[940px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[40px] lg:text-[48px]">
            {data.titleLine} <span className="text-gradient">{data.highlight}</span>
          </h2>
        </Reveal>

        {/* Row 1: Two Large Featured Story Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {featured.map((story, i) => (
            <Reveal key={story.id || i} delay={0.1 * (i + 1)} y={22}>
              <article className="group flex flex-col">
                <div className="overflow-hidden rounded-[14px] border border-white/12 bg-white/[0.03] shadow-[0_20px_45px_-18px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-white/25 sm:rounded-[18px]">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="h-[240px] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105 sm:h-[280px] lg:h-[320px]"
                  />
                </div>

                <h3 className="mt-5 font-display text-[20px] font-medium leading-snug text-white transition-colors duration-300 group-hover:text-accent-soft sm:text-[22px]">
                  {story.title}
                </h3>

                <SiteLink
                  href={story.href || "/portfolio/details"}
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

        {/* Row 2: Three Secondary Story Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-3 lg:mt-12 lg:gap-8">
          {items.map((story, i) => (
            <Reveal key={story.id || i} delay={0.1 * (i + 1)} y={20}>
              <article className="group flex flex-col">
                <div className="overflow-hidden rounded-[12px] border border-white/12 bg-white/[0.03] shadow-[0_16px_36px_-16px_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-white/25 sm:rounded-[16px]">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="h-[180px] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105 sm:h-[190px] lg:h-[210px]"
                  />
                </div>

                <h3 className="mt-4 font-display text-[16px] font-medium leading-snug text-white transition-colors duration-300 group-hover:text-accent-soft sm:text-[18px]">
                  {story.title}
                </h3>

                <SiteLink
                  href={story.href || "/portfolio/details"}
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
      </div>
    </section>
  );
}
