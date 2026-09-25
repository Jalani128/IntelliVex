import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ServiceIntro from "../components/ServiceIntro";
import ServiceBenefits from "../components/ServiceBenefits";
import ServiceFaq from "../components/ServiceFaq";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { SERVICE_DETAIL_HEADER } from "../data/serviceDetail";

export default function ServiceDetail() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={SERVICE_DETAIL_HEADER.title}
          breadcrumbs={SERVICE_DETAIL_HEADER.breadcrumbs}
          gradient
        />
        <ServiceIntro />
        <ServiceBenefits />
        <ServiceFaq />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
