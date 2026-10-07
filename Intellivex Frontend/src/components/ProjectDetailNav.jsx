import { ArrowLeft, ArrowRight } from "lucide-react";
import SiteLink from "./SiteLink";
import Reveal from "./Reveal";

/** Previous / Next project (API order). A missing side leaves its slot empty. */
export default function ProjectDetailNav({ data }) {
  const { prev, next } = data.navigation;
  if (!prev && !next) return null;

  return (
    <section className="relative bg-navy pb-16 sm:pb-20 lg:pb-24">
      <div className="container-narrow relative">
        <Reveal y={16}>
          <div className="flex flex-col items-stretch justify-between gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5 sm:flex-row sm:items-center sm:p-3 md:p-4">
            {/* Previous Project Button */}
            {prev ? (
            <SiteLink
              href={prev.to}
              title={prev.title}
              className="group flex items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 font-display text-[13px] font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white sm:justify-start sm:px-7 sm:py-3.5 sm:text-[14px]"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              <span>{prev.label}</span>
            </SiteLink>
            ) : (
              <span aria-hidden="true" />
            )}

            {/* Next Project Button */}
            {next && (
            <SiteLink
              href={next.to}
              title={next.title}
              className="group flex items-center justify-center gap-2.5 rounded-lg bg-[#1877F2] px-7 py-3 font-display text-[13px] font-medium text-white shadow-[0_4px_16px_rgba(24,119,242,0.35)] transition-all duration-300 hover:bg-[#1565D8] hover:shadow-[0_6px_22px_rgba(24,119,242,0.5)] sm:px-8 sm:py-3.5 sm:text-[14px]"
            >
              <span>{next.label}</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </SiteLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
