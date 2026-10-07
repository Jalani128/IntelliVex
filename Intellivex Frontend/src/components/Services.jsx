import Button from "./Button";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import DecorSquares from "./DecorSquares";
import { SERVICES } from "../data/home";
import { useApiData } from "../hooks/useApiData";
import { fetchFeaturedServices, toServiceCard } from "../services/services";

const SHAPES = [{ className: "left-[3%] top-[3%]", size: 82, drift: 14, duration: 10 }];

/** `heading` defaults to the built-in copy; the Home page passes GET /api/home-page data. */
export default function Services({ heading = SERVICES }) {
  // Featured services from the API (three cards in the design); built-in cards until then.
  const items = useApiData(
    fetchFeaturedServices,
    (rows) => rows.slice(0, 3).map((s) => toServiceCard(s, SERVICES.items[0].icon)),
    SERVICES.items,
  );

  return (
    <section id="services" className="section-pad relative bg-navy pt-0 md:pt-0 lg:pt-0">
      <DecorSquares shapes={SHAPES} />

      <div className="container-narrow relative">
        <SectionHeading
          eyebrow={heading.eyebrow}
          title={heading.title}
          highlight={heading.highlight}
          tail={heading.tail}
          action={
            <Button href="#services" variant="outline" size="sm">
              View All
            </Button>
          }
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, i) => (
            <Reveal key={service.title} delay={0.1 * i} className="h-full">
              <ServiceCard {...service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
