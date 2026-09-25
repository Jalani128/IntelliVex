import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ServiceIntro from "../components/ServiceIntro";
import ServiceBenefits from "../components/ServiceBenefits";
import ConsultationSection from "../components/ConsultationSection";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import {
  CONSULTATION,
  DATA_SCIENCE_BENEFITS,
  DATA_SCIENCE_HEADER,
  DATA_SCIENCE_INTRO,
} from "../data/dataScience";

export default function DataScience() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={DATA_SCIENCE_HEADER.title}
          breadcrumbs={DATA_SCIENCE_HEADER.breadcrumbs}
          gradient
        />
        <ServiceIntro content={DATA_SCIENCE_INTRO} />
        <ServiceBenefits content={DATA_SCIENCE_BENEFITS} />
        <ConsultationSection content={CONSULTATION} />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
