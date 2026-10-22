import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import TestimonialCard from "./TestimonialCard";
import { TESTIMONIALS } from "../data/home";
import { useApiData } from "../hooks/useApiData";
import { fetchTestimonialsPage, toReview } from "../services/testimonials";

/* Home "Real Reviews": the first three reviews from GET /api/testimonials-page.
   There is no built-in copy, so the section stays hidden until reviews arrive. */
export default function Testimonials() {
  const items = useApiData(fetchTestimonialsPage, (d) => (d.reviews ?? []).slice(0, 3).map(toReview), []);

  if (!items.length) return null;

  return (
    <section id="testimonials" className="section-pad relative bg-navy">
      <div className="container-narrow">
        <SectionHeading
          eyebrow={TESTIMONIALS.eyebrow}
          title={TESTIMONIALS.title}
          highlight={TESTIMONIALS.highlight}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((testimonial, i) => (
            <Reveal key={testimonial.id ?? i} delay={0.1 * i} className="h-full">
              <TestimonialCard {...testimonial} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
