import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import TestimonialCard from "./TestimonialCard";
import { REAL_REVIEWS_DATA } from "../data/testimonials";

export default function TestimonialsReviews({ data = REAL_REVIEWS_DATA }) {
  return (
    <section id="real-reviews" className="relative bg-navy pb-16 pt-2 sm:pb-20 sm:pt-4 lg:pb-24 lg:pt-4">
      <div className="container-narrow relative">
        <Reveal y={18}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.08} y={20}>
          <h2 className="mt-3.5 max-w-[940px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[40px] lg:text-[48px]">
            {data.titleLine} <span className="text-gradient">{data.highlight}</span>
          </h2>
        </Reveal>

        {/* 3 Review Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {data.items.map((testimonial, i) => (
            <Reveal key={i} delay={0.1 * (i + 1)} y={24} className="h-full">
              <TestimonialCard {...testimonial} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
