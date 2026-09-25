import Button from "./Button";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import DecorSquares from "./DecorSquares";
import { SERVICES } from "../data/home";

const SHAPES = [{ className: "left-[3%] top-[3%]", size: 82, drift: 14, duration: 10 }];

export default function Services() {
  return (
    <section id="services" className="section-pad relative bg-navy pt-0 md:pt-0 lg:pt-0">
      <DecorSquares shapes={SHAPES} />

      <div className="container-narrow relative">
        <SectionHeading
          eyebrow={SERVICES.eyebrow}
          title={SERVICES.title}
          highlight={SERVICES.highlight}
          action={
            <Button href="#services" variant="outline" size="sm">
              View All
            </Button>
          }
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((service, i) => (
            <Reveal key={service.title} delay={0.1 * i} className="h-full">
              <ServiceCard {...service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
