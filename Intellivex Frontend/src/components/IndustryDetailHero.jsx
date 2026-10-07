import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import RichContent from "./RichContent";

const HERO_SHAPES = [
  { className: "left-[2%] top-[10%]", size: 82, drift: 14, duration: 10, delay: 0.2 },
  { className: "right-[3%] top-[30%]", size: 82, drift: 12, duration: 11, delay: 0.6 },
];

/** Intro of /industries/:slug — `data` from toIndustryDetail() (services/industries.js). */
export default function IndustryDetailHero({ data }) {
  return (
    <section className="relative overflow-hidden bg-navy pb-10 pt-6 sm:pb-14 sm:pt-8 lg:pb-16 lg:pt-10">
      <DecorSquares shapes={HERO_SHAPES} className="hidden lg:block" />

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

        <Reveal delay={0.14} y={16}>
          <RichContent
            html={data.html}
            className="mt-6 max-w-[1060px] text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]"
          />
        </Reveal>

        {data.image && (
          <Reveal delay={0.2} y={20}>
            <div className="group mt-8 overflow-hidden rounded-[14px] border border-white/12 bg-white/[0.03] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.4)] sm:rounded-[18px]">
              <img
                src={data.image.src}
                alt={data.image.alt}
                // An image that fails to load (e.g. unreachable upload) hides its frame.
                onError={(e) => {
                  e.currentTarget.parentElement.style.display = "none";
                }}
                className="w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.015]"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
