import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import { PROCESS } from "../data/about";

/**
 * Exact cubic bezier curve traced pixel-by-pixel from media_1789643706609.png.
 * Coordinate space: 1000 × 550 (matches exact 794:360 proportions and node positions).
 *
 * Flow:
 * - Starts at left margin at (0, 335)
 * - Sweeps down into Node 1 at (58, 367)
 * - Dips into bottom U-trough at (155, 400)
 * - Sweeps up into Node 2 at (388, 285)
 * - Moves horizontally across Node 2 to (510, 284)
 * - Sweeps up into Node 3 at (746, 151)
 * - Crests smoothly at (920, 75)
 * - Curves gently down to right edge at (1000, 86)
 */
const CURVE =
  "M 0 335 " +
  "C 20 348, 38 359, 58 367 " +
  "C 82 376, 115 400, 155 400 " +
  "C 245 400, 315 285, 388 285 " +
  "C 425 285, 470 284, 510 284 " +
  "C 595 284, 670 190, 746 151 " +
  "C 800 120, 860 75, 920 75 " +
  "C 955 75, 980 80, 1000 86";

const STEPS = [
  {
    ...PROCESS.steps[0],
    cx: 58,
    cy: 367,
  },
  {
    ...PROCESS.steps[1],
    cx: 388,
    cy: 285,
  },
  {
    ...PROCESS.steps[2],
    cx: 746,
    cy: 151,
  },
];

export default function ProcessTimeline() {
  const reduced = useReducedMotion();

  return (
    <section
      id="process"
      className="section-pad-inner relative overflow-hidden bg-navy"
    >
      <div className="container-narrow relative">
        {/* ============================================================
            DESKTOP VIEW: Pixel-perfect recreation of media_1789643706609.png
            ============================================================ */}
        <div className="relative hidden w-full lg:block lg:aspect-[1000/550] lg:min-h-[540px] lg:max-h-[640px]">
          {/* Top-Left Header Block: Aligned with container left */}
          <div className="absolute left-0 top-0 z-10 max-w-[440px] xl:max-w-[460px]">
            <Reveal y={15}>
              <Eyebrow>{PROCESS.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08} y={15}>
              <h2 className="mt-3 font-display text-[32px] font-medium leading-[1.15] text-white xl:text-[44px]">
                {PROCESS.title}{" "}
                <span className="text-[#388BFD]">{PROCESS.highlight}</span>
              </h2>
            </Reveal>

            <Reveal delay={0.16} y={15}>
              <p className="mt-4 font-body text-[13.5px] leading-[1.62] text-white/75 xl:text-[14.5px]">
                {PROCESS.description}
              </p>
            </Reveal>
          </div>

          {/* SVG Canvas: Smooth solid electric blue connecting curve */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 550"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
          >
            {/* Subtle glow underlay */}
            <path
              d={CURVE}
              fill="none"
              stroke="#0D99FF"
              strokeWidth="5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="opacity-20 blur-[3px]"
            />

            {/* Crisp solid curve matching Figma */}
            <motion.path
              d={CURVE}
              fill="none"
              stroke="#0D99FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={reduced ? undefined : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>

          {/* Step 1, Step 2, Step 3: Exact anchor at (cx, cy) to guarantee 100% precision with curve */}
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className="absolute z-10 w-[220px] xl:w-[240px]"
              style={{
                left: `${(step.cx / 1000) * 100}%`,
                top: `${(step.cy / 550) * 100}%`,
                transform: "translate(-21px, -21px)",
              }}
            >
              {/* 1. Eyebrow: positioned directly above the node */}
              <div className="absolute bottom-full left-0 mb-3 whitespace-nowrap">
                <Reveal delay={0.15 + i * 0.1} y={-4} amount={0}>
                  <Eyebrow>{step.step}</Eyebrow>
                </Reveal>
              </div>

              {/* 2. Donut Circular Node: exactly centered at (cx, cy) on the line */}
              <div className="flex h-[42px] w-[42px] items-center justify-center">
                <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-[#0656F3] shadow-[0_0_20px_rgba(13,153,255,0.7)] transition-transform duration-300 hover:scale-110">
                  <span className="h-3.5 w-3.5 rounded-full bg-navy border border-[#0D99FF]/80" />
                </span>
              </div>

              {/* 3. Title & Description: positioned directly below the node, aligned with left edge */}
              <div className="mt-4 max-w-[210px] xl:max-w-[230px]">
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
            MOBILE & TABLET VIEW: Responsive vertical timeline (< lg)
            ============================================================ */}
        <div className="block lg:hidden">
          {/* Header Block */}
          <Reveal y={15}>
            <Eyebrow>{PROCESS.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.08} y={15}>
            <h2 className="mt-3 font-display text-[30px] font-medium leading-[1.2] text-white sm:text-[38px]">
              {PROCESS.title}{" "}
              <span className="text-[#388BFD]">{PROCESS.highlight}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16} y={15}>
            <p className="mt-4 font-body text-[14px] leading-[1.6] text-white/75 sm:text-[15px]">
              {PROCESS.description}
            </p>
          </Reveal>

          {/* Vertical Step Timeline with solid connector and donut nodes */}
          <div className="relative mt-10 space-y-10 pl-2 sm:pl-4">
            {/* Vertical connector line */}
            <div
              aria-hidden="true"
              className="absolute bottom-6 left-[20px] top-6 w-[2px] bg-gradient-to-b from-[#0D99FF] via-[#0656F3] to-[#0D99FF]/20 sm:left-[28px]"
            />

            {PROCESS.steps.map((step, i) => (
              <Reveal
                key={step.step}
                delay={0.12 * i}
                y={15}
                className="relative flex items-start gap-5 sm:gap-6"
              >
                {/* Donut Node indicator */}
                <div className="relative z-10 grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#0656F3] shadow-[0_0_16px_rgba(13,153,255,0.6)]">
                  <span className="h-3.5 w-3.5 rounded-full bg-navy border border-[#0D99FF]/80" />
                </div>

                {/* Step Content */}
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
