import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

/**
 * Eyebrow + two-tone heading (+ optional description and right-aligned
 * action) shared by Key Differentiators, Our Services, Featured Projects
 * and Real Reviews.
 */
export default function SectionHeading({ eyebrow, title, highlight, tail, description, action }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-full">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-3 font-display text-[32px] font-medium leading-[1.15] text-white sm:text-[40px] lg:text-[52px]">
            {title} <span className="text-gradient">{highlight}</span>
            {tail && ` ${tail}`}
          </h2>
        </Reveal>

        {description && (
          <Reveal delay={0.16}>
            <p className="mt-4 max-w-[860px] font-body text-[15px] leading-[1.7] text-white/70">
              {description}
            </p>
          </Reveal>
        )}
      </div>

      {action && (
        <Reveal delay={0.16} className="shrink-0 sm:pb-2">
          {action}
        </Reveal>
      )}
    </div>
  );
}
