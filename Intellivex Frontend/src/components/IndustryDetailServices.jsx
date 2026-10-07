import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import Button from "./Button";
import DecorSquares from "./DecorSquares";
import { RELEVANT_SERVICES } from "../data/industryDetail";

const SERVICES_SHAPES = [
  { className: "right-[3%] top-[10%]", size: 82, drift: 15, duration: 11, delay: 0.4 },
];

/** "Relevant Services" — the industry's linked services. Left out when there are none. */
export default function IndustryDetailServices({ data, heading = RELEVANT_SERVICES }) {
  if (data.services.length === 0) return null;

  return (
    <section id="relevant-services" className="relative bg-navy pb-16 pt-4 md:pb-20 lg:pb-[90px] lg:pt-6">
      <DecorSquares shapes={SERVICES_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <SectionHeading
          eyebrow={heading.eyebrow}
          title={heading.title}
          highlight={heading.highlight}
          action={
            <Button href={heading.action.href} variant="light" size="sm">
              {heading.action.label}
            </Button>
          }
        />

        {/* 3-Column Service Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {data.services.map((service, i) => (
            <Reveal key={service.href || i} delay={0.1 * ((i % 3) + 1)} y={24}>
              <ServiceCard {...service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
