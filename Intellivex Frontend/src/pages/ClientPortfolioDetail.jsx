import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ClientPortfolioHero from "../components/ClientPortfolioHero";
import ClientPortfolioSuccessStory from "../components/ClientPortfolioSuccessStory";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import {
  CLIENT_PORTFOLIO_DETAIL_HEADER,
  getClientPortfolioData,
} from "../data/clientPortfolioDetail";

export default function ClientPortfolioDetail() {
  const { slug } = useParams();
  const data = getClientPortfolioData(slug);

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={
            <>
              <span className="text-gradient">Client Portfolio</span> Details
            </>
          }
          breadcrumbs={CLIENT_PORTFOLIO_DETAIL_HEADER.breadcrumbs}
        />

        <ClientPortfolioHero data={data} />
        <ClientPortfolioSuccessStory data={data} />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
