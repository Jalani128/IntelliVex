import { Check } from "lucide-react";
import Reveal from "./Reveal";
import { SERVICE_BENEFITS } from "../data/serviceDetail";

/**
 * "Our Benefits" — unlike the Key Differentiators grid, the frame sets these as
 * bare checkmark rows with no plate behind them, and the heading takes the
 * accent gradient across the whole phrase. Shared by every service page.
 */
export default function ServiceBenefits({ content = SERVICE_BENEFITS }) {
  const { title, description, items } = content;

  return (
    <section id="benefits" className="relative bg-navy pb-14 pt-2 md:pb-16 lg:pb-[70px] lg:pt-4">
      <div className="container-narrow relative">
        <Reveal>
          <h2 className="text-gradient font-display text-[32px] font-medium leading-[1.15] sm:text-[40px] lg:text-[52px] lg:leading-[64px]">
            {title}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-4 max-w-[1060px] font-body text-[15px] leading-[1.62] text-white/80 lg:text-[16px]">
            {description}
          </p>
        </Reveal>

        <ul className="mt-8 grid gap-x-8 gap-y-6 md:grid-cols-2">
          {items.map((text, i) => (
            <Reveal as="li" key={i} delay={0.16 + i * 0.06} y={20}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] bg-accent text-white">
                  <Check size={13} strokeWidth={3} />
                </span>
                <p className="font-body text-[14px] leading-[1.5] text-white/90">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
