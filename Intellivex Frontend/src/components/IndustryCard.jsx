import {
  Landmark,
  HeartPulse,
  ShoppingBag,
  GraduationCap,
  Truck,
  Building2,
  ArrowRight,
  Check,
} from "lucide-react";
import Button from "./Button";

const ICON_MAP = {
  Landmark,
  HeartPulse,
  ShoppingBag,
  GraduationCap,
  Truck,
  Building2,
};

export default function IndustryCard({
  id,
  iconName = "Landmark",
  badge,
  title,
  description,
  tags = [],
  features = [],
}) {
  const IconComponent = ICON_MAP[iconName] || Landmark;

  return (
    <article className="surface-card group flex flex-col justify-between p-6 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-accent/50 hover:shadow-[0_24px_50px_-20px_rgba(6,86,243,0.55)] sm:p-7 lg:p-8">
      <div>
        {/* Top Header Row: Icon & Sector Badge */}
        <div className="flex items-center justify-between gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/40 bg-gradient-to-br from-accent/25 to-accent/5 text-accent shadow-[0_4px_16px_rgba(48,118,255,0.2)] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-110 group-hover:border-accent group-hover:text-white group-hover:shadow-[0_6px_22px_rgba(48,118,255,0.4)]">
            <IconComponent size={24} strokeWidth={2} />
          </div>

          {badge && (
            <span className="rounded-btn border border-white/10 bg-white/[0.04] px-3 py-1 font-body text-[11px] font-medium text-white/80 transition-colors duration-300 group-hover:border-accent/40 group-hover:text-white">
              {badge}
            </span>
          )}
        </div>

        {/* Title & Narrative */}
        <h3 className="mt-6 font-display text-[22px] font-medium leading-tight text-white transition-colors duration-300 group-hover:text-white sm:text-[24px]">
          {title}
        </h3>

        <p className="mt-3 font-body text-[14px] leading-[1.65] text-white/70">
          {description}
        </p>

        {/* Capability Pills */}
        {tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-white/10 px-3 py-1 font-body text-[11px] text-white/80 transition-colors duration-300 group-hover:bg-white/15 group-hover:text-white"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Highlighted Value Propositions */}
        {features.length > 0 && (
          <div className="mt-6 space-y-2.5 border-t border-white/[0.08] pt-4">
            {features.map((feat, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[3px] bg-accent/20 text-accent">
                  <Check size={11} strokeWidth={3} />
                </span>
                <p className="font-body text-[12px] leading-[1.5] text-white/75 sm:text-[13px]">
                  {feat}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Trigger */}
      <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5">
        <Button
          href={id ? `/industries/${id}` : "/industries/details"}
          variant="ghost"
          size="none"
          className="self-start"
        >
          Explore Solutions
        </Button>

        <div className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.05] text-white/70 transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:translate-x-1">
          <ArrowRight size={14} />
        </div>
      </div>
    </article>
  );
}
