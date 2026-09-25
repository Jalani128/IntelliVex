import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import Services from "../components/Services";
import Projects from "../components/Projects";
import CTABanner from "../components/CTABanner";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <Hero />
        <WhyChooseUs />
        <Services />
        <Projects />
        <CTABanner />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
