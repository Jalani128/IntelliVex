import { Check } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import DecorSquares from "./DecorSquares";
import { DIFFERENTIATORS } from "../data/home";

/**
 * "Key Differentiators". The home page and the About Us page share this block
 * verbatim in Figma, so they share the component and differ only in copy.
 *
 * @param {{eyebrow, title, highlight, description, items: string[]}} content
 * @param {Array}  shapes   Optional decorative tile clusters for this section.
 * @param {string} padding  Vertical rhythm; inner pages run tighter than home.
 */
export default function WhyChooseUs({
  id = "why-us",
  content = DIFFERENTIATORS,
  shapes,
  padding = "section-pad",
}) {
  return (
    <section id={id} className={`${padding} relative overflow-hidden bg-navy`}>
      {shapes && <DecorSquares shapes={shapes} className="hidden lg:block" />}

      <div className="container-narrow relative">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          highlight={content.highlight}
          tail={content.tail}
          description={content.description}
        />

        <ul className="mt-10 grid gap-x-[60px] gap-y-5 md:grid-cols-2">
          {content.items.map((text, i) => (
            <Reveal as="li" key={i} delay={0.06 * i} y={20}>
              <div className="group flex min-h-[56px] items-center gap-3.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-accent/60 hover:bg-white/[0.08]">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent text-white transition-transform duration-300 group-hover:scale-110">
                  <Check size={14} strokeWidth={3} />
                </span>
                <p className="font-body text-[14px] font-medium leading-snug text-white/90">
                  {text}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
