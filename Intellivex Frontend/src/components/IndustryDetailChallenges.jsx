import { Check } from "lucide-react";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";

/**
 * Key Challenges (title + two-column checklist) and Case Studies (the
 * industry's linked portfolio projects). Each part is left out when empty.
 */
export default function IndustryDetailChallenges({ data }) {
  const { challenges, caseStudies } = data;
  if (challenges.items.length === 0 && caseStudies.cards.length === 0) return null;

  return (
    <section className="relative bg-navy pb-14 pt-2 sm:pb-16 lg:pb-24 lg:pt-4">
      <div className="container-narrow relative">
        {/* 1. Key Challenges */}
        {challenges.items.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr] lg:gap-14">
            <Reveal y={20}>
              <h3 className="font-display text-[28px] font-medium leading-[1.18] text-white sm:text-[34px] lg:text-[40px]">
                {challenges.title}
              </h3>
            </Reveal>

            {/* Checkmark items grid (2 columns) */}
            <div className="grid grid-cols-1 content-start gap-x-8 gap-y-4 sm:grid-cols-2 sm:gap-y-5 lg:pt-3">
              {challenges.items.map((item, i) => (
                <Reveal key={i} delay={0.12 + i * 0.05} y={14}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[4px] bg-[#1877F2] text-white shadow-[0_2px_8px_rgba(24,119,242,0.35)]">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <p className="font-body text-[13px] leading-[1.5] text-white/85 sm:text-[14px]">
                      {item}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* 2. Case Studies — linked portfolio projects */}
        {caseStudies.cards.length > 0 && (
          <div className={challenges.items.length > 0 ? "mt-14 sm:mt-16 lg:mt-20" : ""}>
            <Reveal y={20}>
              <h3 className="font-display text-[28px] font-medium leading-[1.18] text-white sm:text-[34px] lg:text-[40px]">
                {caseStudies.title}
              </h3>
            </Reveal>

            <div className="mt-8 flex flex-col gap-8 sm:mt-10">
              {caseStudies.cards.map((card, i) => (
                <Reveal key={card.id} delay={0.08 * i} y={20}>
                  <ProjectCard {...card} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
