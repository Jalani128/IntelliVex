import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ConsultationSection from "../components/ConsultationSection";
import CTABanner from "../components/CTABanner";
import ContactMap from "../components/ContactMap";
import Footer from "../components/Footer";
import { CONTACT_HEADER, CONTACT_SECTION } from "../data/contact";

export default function Contact() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={CONTACT_HEADER.title}
          breadcrumbs={CONTACT_HEADER.breadcrumbs}
        />
        <ConsultationSection content={CONTACT_SECTION} />
        <ContactMap />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
