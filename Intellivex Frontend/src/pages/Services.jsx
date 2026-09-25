import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ServicesOverview from "../components/ServicesOverview";
import ServiceCatalog from "../components/ServiceCatalog";
import Projects from "../components/Projects";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { RECENT_PROJECTS, SERVICES_HEADER } from "../data/services";

const PROJECT_SHAPES = [
  { className: "right-[3%] top-[18%]", size: 82, drift: 15, duration: 11, delay: 0.6 },
];

export default function Services() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader title={SERVICES_HEADER.title} breadcrumbs={SERVICES_HEADER.breadcrumbs} />
        <ServicesOverview />
        <ServiceCatalog />
        <Projects
          id="recent-projects"
          content={RECENT_PROJECTS}
          shapes={PROJECT_SHAPES}
          padding="section-pad-inner"
        />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
