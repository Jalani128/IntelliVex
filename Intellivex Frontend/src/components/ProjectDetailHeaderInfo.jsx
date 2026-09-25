import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import { PROJECT_DETAIL_DATA } from "../data/projectDetail";

const SHAPES = [
  { className: "left-[2%] top-[10%]", size: 82, drift: 14, duration: 10, delay: 0.2 },
  { className: "right-[3%] top-[25%]", size: 82, drift: 12, duration: 11, delay: 0.6 },
];

export default function ProjectDetailHeaderInfo({ data = PROJECT_DETAIL_DATA }) {
  return (
    <section className="relative overflow-hidden bg-navy pb-8 pt-6 sm:pb-10 sm:pt-8 lg:pb-10 lg:pt-10">
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

        <Reveal delay={0.16} y={16}>
          <p className="mt-4 max-w-[920px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]">
            {data.description}
          </p>
        </Reveal>

        {/* Client & Tags metadata row */}
        <Reveal delay={0.22} y={14}>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-transparent pb-2 sm:mt-8">
            {/* Left: Client / Industry */}
            <div className="flex items-center gap-3">
              <span className="font-body text-[13px] font-normal text-white/80 sm:text-[14px]">
                {data.clientLabel}
              </span>
              <span className="rounded-btn bg-[#1877F2] px-4 py-1.5 font-body text-[13px] font-medium text-white shadow-[0_2px_12px_rgba(24,119,242,0.35)]">
                {data.clientValue}
              </span>
            </div>

            {/* Right: Deliverables / Tag pills */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 font-body text-[12px] font-medium text-white/85 backdrop-blur-sm transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.1] sm:text-[13px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
