import { Star } from "lucide-react";

export default function TestimonialCard({ rating = 5, quote, name, role, initials }) {
  return (
    <article className="surface-card flex h-full flex-col p-8 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-2 hover:border-accent/50 hover:shadow-[0_28px_60px_-24px_rgba(6,86,243,0.6)]">
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={17}
            className={i < rating ? "fill-star text-star" : "fill-white/15 text-white/15"}
          />
        ))}
      </div>

      <p className="mt-5 flex-1 font-body text-[14px] leading-[1.7] text-white/80">{quote}</p>

      <div className="mt-8 flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent font-display text-[11px] font-semibold text-white">
          {initials}
        </span>
        <div>
          <p className="font-display text-[14px] font-semibold leading-tight text-white">{name}</p>
          <p className="font-body text-[12px] leading-tight text-white/60">{role}</p>
        </div>
      </div>
    </article>
  );
}
