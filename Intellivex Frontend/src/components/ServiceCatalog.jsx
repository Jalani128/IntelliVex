import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import AIInnovationCard from "./AIInnovationCard";
import { AI_INNOVATION_CARD, SERVICE_CATALOG, withSubServices } from "../data/services";
import { useApiData } from "../hooks/useApiData";
import { fetchCatalogServices, toCatalogItem, toServiceLinks } from "../services/services";


/** `heading` defaults to the built-in copy; the Services page passes GET /api/services-page data. */
export default function ServiceCatalog({ heading = SERVICE_CATALOG }) {
  const { cards, links } = useApiData(
    fetchCatalogServices,
    (rows) => ({ cards: rows.map((s) => toCatalogItem(s, SERVICE_CATALOG.items[0].icon)), links: toServiceLinks(rows) }),
    { cards: SERVICE_CATALOG.items, links: [] },
  );
  // The AI & Data Innovation card always comes first. Its pills list the services
  // added in Admin (each opens its own page); the built-in tags show until the API answers.
  // The API's innovation row only lends its link, so it isn't shown twice.
  const apiInnovation = cards.find((c) => c.variant === "innovation");
  const aiHref = apiInnovation?.href;
  const items = [
    {
      ...AI_INNOVATION_CARD,
      href: aiHref,
      description: apiInnovation?.description || AI_INNOVATION_CARD.description,
      tags: links.length ? links : AI_INNOVATION_CARD.tags,
    },
    ...cards.filter((c) => c.variant !== "innovation").map(withSubServices),
  ];

  return (
    <section id="services" className="section-pad-inner relative bg-navy">
      <div className="container-narrow relative">
        <SectionHeading
          eyebrow={heading.eyebrow}
          title={heading.title}
          highlight={heading.highlight}
          tail={heading.tail}
        />

        {/* auto-rows-fr: every row as tall as the tallest, so all cards match in size. */}
        <div className="mt-10 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, i) => (
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
