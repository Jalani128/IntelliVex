import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import { PROCESS } from "../data/about";

/**
 * Thin wave traced from the design. Coordinate space: 1000 × 550
 * (node anchors below are in the same space).
 *
 * Flow:
 * - Enters from the left edge and sweeps down through Node 1 at (58, 367)
 * - Dips into a soft trough, then rises into Node 2 at (388, 285)
 * - Runs level briefly, then climbs into Node 3 at (746, 151)
 * - Crests past Node 3 and eases off beyond the right edge
 */
const CURVE =
  "M -15 318 " +
  "C 10 335, 35 355, 58 367 " +
  "C 82 380, 115 400, 155 400 " +
  "C 245 400, 315 285, 388 285 " +
  "C 425 285, 470 284, 510 284 " +
  "C 595 284, 670 190, 746 151 " +
  "C 800 120, 860 75, 920 75 " +
  "C 955 75, 985 80, 1010 88";

/** Marker positions of the three steps on the wave. */
const ANCHORS = [
  { cx: 58, cy: 367 },
  { cx: 388, cy: 285 },
  { cx: 746, cy: 151 },
];

/** Blue filled circle with a navy centre dot. */
function StepMarker() {
  return (
    <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#0656F3] transition-transform duration-300 hover:scale-110">
      <span className="h-3.5 w-3.5 rounded-full bg-navy" />
    </span>
  );
}

/** `content` defaults to the built-in copy; the About page passes GET /api/about-page data. */
export default function ProcessTimeline({ content = PROCESS }) {
  const reduced = useReducedMotion();
  const STEPS = content.steps.slice(0, ANCHORS.length).map((step, i) => ({ ...step, ...ANCHORS[i] }));

  return (
    <section
      id="process"
      className="section-pad-inner relative overflow-hidden bg-navy"
    >
      <div className="container-narrow relative">
        {/* ============================================================
            DESKTOP VIEW: ascending staircase with flowing wave line
            ============================================================ */}
        <div className="relative hidden w-full lg:block lg:aspect-[1000/550] lg:min-h-[540px] lg:max-h-[640px]">
          {/* Top-left header block */}
          <div className="absolute left-0 top-0 z-10 max-w-[440px] xl:max-w-[460px]">
            <Reveal y={15}>
              <Eyebrow>{content.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08} y={15}>
              <h2 className="mt-3 font-display text-[32px] font-medium leading-[1.15] text-white xl:text-[44px]">
                {content.title}{" "}
                <span className="text-[#4F8DFF]">{content.highlight}</span>
                {content.tail && ` ${content.tail}`}
              </h2>
            </Reveal>

            <Reveal delay={0.16} y={15}>
              <p className="mt-4 font-body text-[13.5px] leading-[1.62] text-white/70 xl:text-[14.5px]">
                {content.description}
              </p>
            </Reveal>
          </div>

          {/* Thin blue wave connecting the steps, softly fading at both ends */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 550"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient
                id="process-line-fade"
                gradientUnits="userSpaceOnUse"
                x1="-15"
                y1="0"
                x2="1010"
                y2="0"
              >
                <stop offset="0%" stopColor="#3076FF" stopOpacity="0.3" />
                <stop offset="6%" stopColor="#3076FF" stopOpacity="1" />
                <stop offset="85%" stopColor="#3076FF" stopOpacity="1" />
                <stop offset="100%" stopColor="#3076FF" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            <motion.path
              d={CURVE}
              fill="none"
              stroke="url(#process-line-fade)"
              strokeWidth="1.25"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={reduced ? undefined : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>

          {/* Steps anchored so each marker centre sits exactly on (cx, cy) */}
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className="absolute z-10 w-[220px] xl:w-[260px]"
              style={{
                left: `${(step.cx / 1000) * 100}%`,
                top: `${(step.cy / 550) * 100}%`,
                transform: "translate(-21px, -21px)",
              }}
            >
              <div className="absolute bottom-full left-0 mb-3 whitespace-nowrap">
                <Reveal delay={0.15 + i * 0.1} y={-4} amount={0}>
                  <Eyebrow>{step.step}</Eyebrow>
                </Reveal>
              </div>

              <StepMarker />

              <div className="mt-4 max-w-[210px] xl:max-w-[255px]">
                <Reveal delay={0.22 + i * 0.1} y={6} amount={0}>
                  <h3 className="font-display text-[19px] font-medium leading-[1.25] text-white xl:text-[21px]">
                    {step.title}
                  </h3>
                </Reveal>

                <Reveal delay={0.28 + i * 0.1} y={6} amount={0}>
                  <p className="mt-2 font-body text-[13px] leading-[1.62] text-white/70 xl:text-[13.5px]">
                    {step.description}
                  </p>
                </Reveal>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================
            MOBILE & TABLET VIEW: vertical timeline (< lg)
            ============================================================ */}
        <div className="block lg:hidden">
          <Reveal y={15}>
            <Eyebrow>{content.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.08} y={15}>
            <h2 className="mt-3 font-display text-[30px] font-medium leading-[1.2] text-white sm:text-[38px]">
              {content.title}{" "}
              <span className="text-[#4F8DFF]">{content.highlight}</span>
              {content.tail && ` ${content.tail}`}
            </h2>
          </Reveal>

          <Reveal delay={0.16} y={15}>
            <p className="mt-4 font-body text-[14px] leading-[1.6] text-white/70 sm:text-[15px]">
              {content.description}
            </p>
          </Reveal>

          <div className="relative mt-10 space-y-10 pl-2 sm:pl-4">
            <div
              aria-hidden="true"
              className="absolute bottom-6 left-[28.5px] top-6 w-px bg-gradient-to-b from-[#3076FF] via-[#3076FF] to-[#3076FF]/20 sm:left-[36.5px]"
            />

            {content.steps.map((step, i) => (
              <Reveal
                key={step.step}
                delay={0.12 * i}
                y={15}
                className="relative flex items-start gap-5 sm:gap-6"
              >
                <div className="relative z-10">
                  <StepMarker />
                </div>

                <div className="pt-0.5">
                  <Eyebrow>{step.step}</Eyebrow>
                  <h3 className="mt-2.5 font-display text-[19px] font-medium leading-[1.25] text-white sm:text-[22px]">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 font-body text-[13.5px] leading-[1.6] text-white/70 sm:text-[14px]">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
