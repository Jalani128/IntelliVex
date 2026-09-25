import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import { SERVICES_OVERVIEW } from "../data/services";

/* One cluster low on the left, level with the last paragraph. */
const OVERVIEW_SHAPES = [
  { className: "left-[3%] bottom-[12%]", size: 82, drift: 14, duration: 10, delay: 0.4 },
];

/**
 * "Services Overview" — the block the Services page opens with: a full-width
 * heading over a copy column, with a square image held to the right.
 */
export default function ServicesOverview() {
  return (
    <section
      id="services-overview"
      className="bg-about-glow relative overflow-hidden bg-navy pb-14 pt-4 md:pb-16 md:pt-8 lg:pb-[70px] lg:pt-[52px]"
    >
      <DecorSquares shapes={OVERVIEW_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal y={20}>
          <Eyebrow>{SERVICES_OVERVIEW.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Line 1 measures 913px at 52px Outfit, so the column is held at 940
              and the designed break after "Advanced" is set explicitly — below
              lg the type is smaller and wraps on its own. */}
          <h2 className="mt-4 max-w-[940px] font-display text-[32px] font-medium leading-[1.15] text-white sm:text-[40px] lg:text-[52px] lg:leading-[64px]">
            {SERVICES_OVERVIEW.titleLine1}
            <br className="hidden lg:inline" />{" "}
            <span className="text-gradient">{SERVICES_OVERVIEW.highlight}</span>{" "}
            {SERVICES_OVERVIEW.titleTail}
          </h2>
        </Reveal>

        {/* The exported image is 307 × 323, so the column is held to its native
            width — upscaling a photo to a wider column softens it. */}
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_307px] lg:gap-x-[60px]">
          <div className="space-y-[26px]">
            {SERVICES_OVERVIEW.paragraphs.map((text, i) => (
              <Reveal key={i} delay={0.2 + i * 0.08}>
                <p className="font-body text-[15px] leading-[1.62] text-white/80 lg:text-[16px]">
                  {text}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.24} className="w-full">
            <img
              src={SERVICES_OVERVIEW.image.src}
              alt={SERVICES_OVERVIEW.image.alt}
              width={307}
              height={323}
              className="w-full rounded-card"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
