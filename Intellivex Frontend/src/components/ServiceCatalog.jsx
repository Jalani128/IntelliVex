import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import AIInnovationCard from "./AIInnovationCard";
import { SERVICE_CATALOG } from "../data/services";

/**
 * "Our Services" on the Services page — the home page's three cards extended to
 * the full 3 × 2 grid, with the AI & Data Innovation card in the last cell.
 */
export default function ServiceCatalog() {
  return (
    <section id="services" className="section-pad-inner relative bg-navy">
      <div className="container-narrow relative">
        <SectionHeading
          eyebrow={SERVICE_CATALOG.eyebrow}
          title={SERVICE_CATALOG.title}
          highlight={SERVICE_CATALOG.highlight}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATALOG.items.map((service, i) => (
            <Reveal key={service.title} delay={0.08 * i} className="h-full">
              {service.variant === "innovation" ? (
                <AIInnovationCard {...service} />
              ) : (
                <ServiceCard {...service} />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
