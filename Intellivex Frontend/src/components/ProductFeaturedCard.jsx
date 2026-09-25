import { Check } from "lucide-react";
import Button from "./Button";

export default function ProductFeaturedCard({
  badge,
  title,
  headline,
  description,
  features = [],
  image,
  imageAlt,
  href = "#",
  actionLabel = "Explore Product",
}) {
  return (
    <article className="surface-card group grid gap-8 p-6 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-accent/50 hover:shadow-[0_28px_60px_-24px_rgba(6,86,243,0.55)] sm:p-8 lg:grid-cols-[1fr_minmax(0,520px)] lg:items-center lg:gap-12 lg:p-10 xl:grid-cols-[1fr_minmax(0,560px)]">
      {/* Product Content Column */}
      <div className="flex flex-col justify-center">
        {badge && (
          <span className="w-fit rounded-btn border border-accent/40 bg-accent/20 px-3.5 py-1.5 font-body text-[12px] font-medium text-accent-soft">
            {badge}
          </span>
        )}

        <h3 className="mt-4 font-display text-[26px] font-medium leading-tight text-white sm:text-[32px] lg:text-[36px]">
          {title}
        </h3>

        {headline && (
          <h4 className="mt-2 font-display text-[15px] font-medium text-white/90 sm:text-[16px]">
            {headline}
          </h4>
        )}

        <p className="mt-3 max-w-[480px] font-body text-[14px] leading-[1.65] text-white/70">
          {description}
        </p>

        {features.length > 0 && (
          <div className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[4px] bg-accent/25 text-accent shadow-[0_0_10px_rgba(48,118,255,0.3)]">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="font-body text-[13px] leading-[1.5] text-white/85 sm:text-[14px]">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center gap-4">
          <Button href={href} variant="light" size="sm">
            {actionLabel}
          </Button>
          <Button href="#contact" variant="ghost" size="none" className="text-[13px]">
            Request Demo
          </Button>
        </div>
      </div>

      {/* Product Mockup Display Column */}
      <div className="relative overflow-hidden rounded-xl border border-white/15 bg-navy-deep/90 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-500 ease-[var(--ease-out-soft)] group-hover:border-accent/40 group-hover:shadow-[0_25px_60px_-15px_rgba(48,118,255,0.3)]">
        <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/11]">
          <img
            src={image}
            alt={imageAlt || title}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
          />
          {/* Subtle bottom gradient glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/40 via-transparent to-transparent opacity-60" />
        </div>
      </div>
    </article>
  );
}
