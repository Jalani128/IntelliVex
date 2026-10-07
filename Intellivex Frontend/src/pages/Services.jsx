import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ServicesOverview from "../components/ServicesOverview";
import ServiceCatalog from "../components/ServiceCatalog";
import Projects from "../components/Projects";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { RECENT_PROJECTS, SERVICE_CATALOG, SERVICES_HEADER, SERVICES_OVERVIEW } from "../data/services";
import { CTA } from "../data/home";
import { useApiData } from "../hooks/useApiData";
import { fetchServicesPage, toServicesPage } from "../services/pages";

/* Built-in content, shown until GET /api/services-page answers (and if it fails). */
const FALLBACK = { overview: SERVICES_OVERVIEW, services: SERVICE_CATALOG, cta: CTA };

/* Latest published projects, in portfolio order. */
const RECENT_QUERY = {};

const PROJECT_SHAPES = [
  { className: "right-[3%] top-[18%]", size: 82, drift: 15, duration: 11, delay: 0.6 },
];

export default function Services() {
  const page = useApiData(fetchServicesPage, (d) => toServicesPage(d, FALLBACK), FALLBACK);

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader title={SERVICES_HEADER.title} breadcrumbs={SERVICES_HEADER.breadcrumbs} />
        <ServicesOverview content={page.overview} />
        <ServiceCatalog heading={page.services} />
        <Projects
          id="recent-projects"
          content={RECENT_PROJECTS}
          query={RECENT_QUERY}
          shapes={PROJECT_SHAPES}
          padding="section-pad-inner"
        />
        <CTABanner content={page.cta} />
      </main>
      <Footer />
    </div>
  );
}
