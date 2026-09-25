import SectionHeading from "./SectionHeading";
import Button from "./Button";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import { PRODUCT_ECOSYSTEM } from "../data/products";

const ECOSYSTEM_SHAPES = [
  { className: "right-[3%] top-[20%]", size: 82, drift: 15, duration: 11, delay: 0.6 },
];

export default function ProductEcosystem({ content = PRODUCT_ECOSYSTEM }) {
  return (
    <section id="products-catalog" className="relative bg-navy py-16 md:py-20 lg:py-[90px]">
      <DecorSquares shapes={ECOSYSTEM_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          highlight={content.highlight}
          action={
            content.action && (
              <Button href={content.action.href} variant="outline" size="sm">
                {content.action.label}
              </Button>
            )
          }
        />

        {content.description && (
          <Reveal delay={0.08}>
            <p className="mt-3 max-w-[580px] font-body text-[14px] leading-[1.65] text-white/70 sm:text-[15px]">
              {content.description}
            </p>
          </Reveal>
        )}

        <div className="mt-10 flex flex-col divide-y divide-white/10 rounded-2xl border border-white/12 bg-white/[0.02]">
          {content.items.map((item, idx) => (
            <Reveal key={item.id || idx} delay={0.08 * idx}>
              <article className="group flex flex-col justify-between gap-6 p-6 transition-all duration-300 hover:bg-white/[0.03] sm:p-8 lg:flex-row lg:items-center">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start lg:items-center">
                  {/* Brand Logo Container */}
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/[0.04] p-3 shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 ease-[var(--ease-out-soft)] group-hover:border-accent/50 group-hover:bg-accent/10 sm:h-16 sm:w-16">
                    <img
                      src={item.logo}
                      alt={item.title}
                      className="h-auto max-h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Narrative details */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-[20px] font-medium text-white sm:text-[22px]">
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span className="rounded-btn border border-white/15 bg-white/10 px-2.5 py-0.5 font-body text-[11px] font-medium text-white/90">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {item.subtitle && (
                      <p className="mt-1 font-body text-[13px] font-medium text-accent-soft">
                        {item.subtitle}
                      </p>
                    )}

                    <p className="mt-2 max-w-[560px] font-body text-[14px] leading-[1.6] text-white/70">
                      {item.description}
                    </p>

                    {item.tags && item.tags.length > 0 && (
                      <ul className="mt-3.5 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full bg-white/5 px-2.5 py-1 font-body text-[11px] text-white/70"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Right Action */}
                <div className="shrink-0 self-start lg:self-center">
                  <Button
                    href={item.href || "#"}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    View Details
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
