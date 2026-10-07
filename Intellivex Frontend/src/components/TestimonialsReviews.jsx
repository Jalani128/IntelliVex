import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import TestimonialCard from "./TestimonialCard";

/**
 * "Real Reviews" — `data`: { eyebrow, lead, highlight, tail, description, items }.
 * Left out when there are no reviews.
 */
export default function TestimonialsReviews({ data }) {
  if (data.items.length === 0) return null;

  return (
    <section id="real-reviews" className="relative bg-navy pb-16 pt-2 sm:pb-20 sm:pt-4 lg:pb-24 lg:pt-4">
      <div className="container-narrow relative">
        <Reveal y={18}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.08} y={20}>
          <h2 className="mt-3.5 max-w-[940px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[40px] lg:text-[48px]">
            {data.lead} <span className="text-gradient">{data.highlight}</span>
            {data.tail && ` ${data.tail}`}
          </h2>
        </Reveal>

        {data.description && (
          <Reveal delay={0.12} y={16}>
            <p className="mt-4 max-w-[1060px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]">
              {data.description}
            </p>
          </Reveal>
        )}

        {/* Review Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {data.items.map((testimonial, i) => (
            <Reveal key={testimonial.id ?? i} delay={0.1 * ((i % 3) + 1)} y={24} className="h-full">
              <TestimonialCard {...testimonial} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
