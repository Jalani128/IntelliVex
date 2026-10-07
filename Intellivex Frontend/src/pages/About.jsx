import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import CompanyOverview from "../components/CompanyOverview";
import ProcessTimeline from "../components/ProcessTimeline";
import WhyChooseUs from "../components/WhyChooseUs";
import Leadership from "../components/Leadership";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { ABOUT_DIFFERENTIATORS, ABOUT_HEADER, ABOUT_CTA, OVERVIEW, PROCESS } from "../data/about";
import { useApiData } from "../hooks/useApiData";
import { fetchAboutPage, toAboutPage } from "../services/pages";

/* Built-in content, shown until GET /api/about-page answers (and if it fails). */
const FALLBACK = { overview: OVERVIEW, process: PROCESS, differentiators: ABOUT_DIFFERENTIATORS, cta: ABOUT_CTA };

const DIFFERENTIATOR_SHAPES = [
  { className: "right-[3%] top-[24%]", size: 82, drift: 15, duration: 11, delay: 0.6 },
];

export default function About() {
  const page = useApiData(fetchAboutPage, (d) => toAboutPage(d, FALLBACK), FALLBACK);

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={
            <>
              <span className="text-gradient">About</span>{" "}
              <span className="text-white">Us</span>
            </>
          }
          breadcrumbs={ABOUT_HEADER.breadcrumbs}
        />
        <CompanyOverview content={page.overview} />
        <ProcessTimeline content={page.process} />
        <WhyChooseUs
          id="differentiators"
          content={page.differentiators}
          shapes={DIFFERENTIATOR_SHAPES}
          padding="section-pad-inner"
        />
        <Leadership />
        <CTABanner content={page.cta} />
      </main>
      <Footer />
    </div>
  );
}
