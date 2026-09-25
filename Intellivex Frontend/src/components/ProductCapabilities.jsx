import { Zap, ShieldCheck, Layers, Cpu, Database, Network } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import { PRODUCT_CAPABILITIES } from "../data/products";

const ICON_MAP = {
  Zap,
  ShieldCheck,
  Layers,
  Cpu,
  Database,
  Network,
};

const CAPABILITY_SHAPES = [
  { className: "left-[2%] top-[25%]", size: 82, drift: 14, duration: 10, delay: 0.4 },
];

export default function ProductCapabilities({ content = PRODUCT_CAPABILITIES }) {
  return (
    <section id="product-capabilities" className="relative bg-navy py-16 md:py-20 lg:py-[90px]">
      <DecorSquares shapes={CAPABILITY_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <div className="text-center">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            highlight={content.highlight}
            className="flex flex-col items-center text-center"
          />
          {content.description && (
            <Reveal delay={0.1}>
              <p className="mx-auto mt-4 max-w-[620px] font-body text-[15px] leading-[1.65] text-white/75">
                {content.description}
              </p>
            </Reveal>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          {content.items.map((item, idx) => {
            const IconComponent = ICON_MAP[item.iconName] || Zap;
            return (
              <Reveal key={item.title || idx} delay={0.1 * idx} y={24}>
                <article className="surface-card group flex h-full flex-col justify-between p-6 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-accent/50 hover:shadow-[0_24px_50px_-20px_rgba(6,86,243,0.55)] sm:p-7 lg:p-8">
                  <div>
                    {/* Glowing Icon Frame */}
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/40 bg-gradient-to-br from-accent/25 to-accent/5 text-accent shadow-[0_4px_16px_rgba(48,118,255,0.2)] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-110 group-hover:border-accent group-hover:text-white group-hover:shadow-[0_6px_22px_rgba(48,118,255,0.4)]">
                      <IconComponent size={24} strokeWidth={2} />
                    </div>

                    <h3 className="mt-6 font-display text-[20px] font-medium leading-tight text-white transition-colors duration-300 group-hover:text-white sm:text-[22px]">
                      {item.title}
                    </h3>

                    <p className="mt-3 font-body text-[14px] leading-[1.65] text-white/70">
                      {item.description}
                    </p>
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-white/10 px-3 py-1 font-body text-[11px] text-white/80 transition-colors duration-300 group-hover:bg-white/15 group-hover:text-white"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
