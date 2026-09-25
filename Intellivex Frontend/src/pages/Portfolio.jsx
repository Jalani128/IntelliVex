import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import PortfolioOverview from "../components/PortfolioOverview";
import CTABanner from "../components/CTABanner";
import PortfolioGrid from "../components/PortfolioGrid";
import Footer from "../components/Footer";
import { PORTFOLIO_HEADER } from "../data/portfolio";

export default function Portfolio() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={PORTFOLIO_HEADER.title}
          breadcrumbs={PORTFOLIO_HEADER.breadcrumbs}
        />
        <PortfolioOverview />
        <PortfolioGrid />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
