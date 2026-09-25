import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import TestimonialCard from "./TestimonialCard";
import { TESTIMONIALS } from "../data/home";

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-pad relative bg-navy">
      <div className="container-narrow">
        <SectionHeading
          eyebrow={TESTIMONIALS.eyebrow}
          title={TESTIMONIALS.title}
          highlight={TESTIMONIALS.highlight}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.items.map((testimonial, i) => (
            <Reveal key={i} delay={0.1 * i} className="h-full">
              <TestimonialCard {...testimonial} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
