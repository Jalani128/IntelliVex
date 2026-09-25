import Reveal from "./Reveal";
import { TESTIMONIALS_LOGOS } from "../data/testimonials";

export default function TestimonialsLogoBar({ logos = TESTIMONIALS_LOGOS }) {
  return (
    <div className="relative bg-navy pb-10 pt-4 sm:pb-12 sm:pt-6 lg:pb-14">
      <div className="container-narrow flex flex-wrap items-center justify-center gap-10 opacity-80 transition-opacity duration-300 hover:opacity-100 sm:justify-between sm:gap-12">
        {logos.map((logo, i) => (
          <Reveal key={i} delay={0.06 * i} y={10} className="flex justify-center">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-7 w-auto object-contain transition-transform duration-300 hover:scale-105 sm:h-8 lg:h-9"
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
