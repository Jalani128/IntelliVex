import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import Services from "../components/Services";
import Projects from "../components/Projects";
import CTABanner from "../components/CTABanner";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { CTA, DIFFERENTIATORS, SERVICES } from "../data/home";
import { useApiData } from "../hooks/useApiData";
import { fetchHomePage, toHomePage } from "../services/pages";

/* Built-in content, shown until GET /api/home-page answers (and if it fails). */
const FALLBACK = { differentiators: DIFFERENTIATORS, services: SERVICES, cta: CTA };

export default function Home() {
  const page = useApiData(fetchHomePage, (d) => toHomePage(d, FALLBACK), FALLBACK);

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <Hero />
        <WhyChooseUs content={page.differentiators} />
        <Services heading={page.services} />
        <Projects />
        <CTABanner content={page.cta} />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
