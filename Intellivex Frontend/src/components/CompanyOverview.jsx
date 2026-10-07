import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import PillarPanel from "./PillarPanel";
import TrustedPartnersCard from "./TrustedPartnersCard";
import { OVERVIEW } from "../data/about";

/* One cluster sits low on the left, level with the Vision plate. */
const OVERVIEW_SHAPES = [
  { className: "left-[3%] bottom-[14%]", size: 82, drift: 14, duration: 10, delay: 0.4 },
];

/** `content` defaults to the built-in copy; the About page passes GET /api/about-page data. */
export default function CompanyOverview({ content = OVERVIEW }) {
  return (
    <section
      id="company-overview"
      className="bg-about-glow relative overflow-hidden bg-navy pb-14 pt-4 md:pb-16 md:pt-8 lg:pb-[70px] lg:pt-[52px]"
    >
      <DecorSquares shapes={OVERVIEW_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal y={20}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-4 max-w-[860px] font-display text-[32px] font-medium leading-[1.15] text-white sm:text-[40px] lg:text-[52px] lg:leading-[64px]">
            {content.title} <span className="text-gradient">{content.highlight}</span>
            {content.tail && ` ${content.tail}`}
          </h2>
        </Reveal>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_306px] lg:gap-x-14">
          <div className="space-y-[26px]">
            {content.paragraphs.map((text, i) => (
              <Reveal key={i} delay={0.2 + i * 0.08}>
                <p className="font-body text-[15px] leading-[1.62] text-white/80 lg:text-[16px]">
                  {text}
                </p>
              </Reveal>
            ))}
          </div>

          <TrustedPartnersCard {...content.partners} />
        </div>

        <div className="mt-12 space-y-6">
          {content.pillars.map((pillar, i) => (
            <PillarPanel key={pillar.highlight} {...pillar} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
