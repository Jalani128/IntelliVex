import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import TestimonialsLogoBar from "../components/TestimonialsLogoBar";
import ClientPortfolio from "../components/ClientPortfolio";
import TestimonialsReviews from "../components/TestimonialsReviews";
import SuccessStories from "../components/SuccessStories";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import {
  TESTIMONIALS_HEADER,
  TESTIMONIALS_LOGOS,
  CLIENT_PORTFOLIO_DATA,
  REAL_REVIEWS_DATA,
  SUCCESS_STORIES_DATA,
  TESTIMONIALS_CTA,
} from "../data/testimonials";

export default function Testimonials() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={
            <>
              <span className="text-gradient">Testimon</span>ials
            </>
          }
          breadcrumbs={TESTIMONIALS_HEADER.breadcrumbs}
        />

        <TestimonialsLogoBar logos={TESTIMONIALS_LOGOS} />
        <ClientPortfolio data={CLIENT_PORTFOLIO_DATA} />
        <TestimonialsReviews data={REAL_REVIEWS_DATA} />
        <SuccessStories data={SUCCESS_STORIES_DATA} />
        <CTABanner content={TESTIMONIALS_CTA} />
      </main>
      <Footer />
    </div>
  );
}
