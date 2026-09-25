import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";

const HERO_SHAPES = [
  { className: "left-[2%] top-[10%]", size: 82, drift: 14, duration: 10, delay: 0.2 },
  { className: "right-[3%] top-[30%]", size: 82, drift: 12, duration: 11, delay: 0.6 },
];

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
            {data.titleLine} <span className="text-gradient">{data.highlight}</span>
          </h2>
        </Reveal>

        <div className="mt-6 space-y-5 sm:space-y-6">
          {data.paragraphs.map((text, i) => (
            <Reveal key={i} delay={0.14 + i * 0.06} y={16}>
              <p className="max-w-[1060px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]">
                {text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
