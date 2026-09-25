import { Check } from "lucide-react";
import Reveal from "./Reveal";
import { PROJECT_DETAIL_DATA } from "../data/projectDetail";

export default function ProjectDetailDescription({ data = PROJECT_DETAIL_DATA }) {
  const { challenge, caseStudies } = data;

  return (
    <section className="relative bg-navy pb-14 pt-2 sm:pb-16 lg:pb-24 lg:pt-4">
      <div className="container-narrow relative">
        {/* 1. The challenge of project */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr] lg:gap-14">
          <Reveal y={20}>
            <h3 className="font-display text-[28px] font-medium leading-[1.18] text-white sm:text-[34px] lg:text-[40px]">
              The challenge of <br className="hidden sm:inline" />
              project
            </h3>
          </Reveal>

          <div className="flex flex-col">
            <Reveal delay={0.08} y={18}>
              <p className="font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]">
                {challenge.description}
              </p>
            </Reveal>

            {/* Checkmark deliverables grid */}
            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:mt-7 sm:grid-cols-2 sm:gap-y-5">
              {challenge.items.map((item, i) => (
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
        </div>

        {/* 2. Case Studies */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 lg:mt-20 lg:grid-cols-[340px_1fr] lg:gap-14">
          <Reveal y={20}>
            <h3 className="font-display text-[28px] font-medium leading-[1.18] text-white sm:text-[34px] lg:text-[40px]">
              {caseStudies.title}
            </h3>
          </Reveal>

          <div className="space-y-5 sm:space-y-6">
            {caseStudies.paragraphs.map((text, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)} y={16}>
                <p className="font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]">
                  {text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
