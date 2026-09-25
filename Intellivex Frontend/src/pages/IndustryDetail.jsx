import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import IndustryDetailHero from "../components/IndustryDetailHero";
import IndustryDetailChallenges from "../components/IndustryDetailChallenges";
import IndustryDetailServices from "../components/IndustryDetailServices";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import {
  INDUSTRY_DETAIL_HEADER,
  getIndustryData,
} from "../data/industryDetail";

export default function IndustryDetail() {
  const { slug } = useParams();
  const data = getIndustryData(slug);

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={
            <>
              <span className="text-gradient">Industry</span> Details
            </>
          }
          breadcrumbs={INDUSTRY_DETAIL_HEADER.breadcrumbs}
        />

        <IndustryDetailHero data={data} />
        <IndustryDetailChallenges data={data} />
        <IndustryDetailServices data={data} />
        <CTABanner content={data.cta} />
      </main>
      <Footer />
    </div>
  );
}
