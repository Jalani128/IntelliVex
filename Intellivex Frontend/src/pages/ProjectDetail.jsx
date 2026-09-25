import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ProjectDetailHeaderInfo from "../components/ProjectDetailHeaderInfo";
import ProjectDetailGallery from "../components/ProjectDetailGallery";
import ProjectDetailDescription from "../components/ProjectDetailDescription";
import ProjectDetailNav from "../components/ProjectDetailNav";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import { PROJECT_DETAIL_HEADER, PROJECT_DETAIL_DATA } from "../data/projectDetail";

export default function ProjectDetail() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={
            <>
              <span className="text-gradient">Project</span> Details
            </>
          }
          breadcrumbs={PROJECT_DETAIL_HEADER.breadcrumbs}
        />
        <ProjectDetailHeaderInfo data={PROJECT_DETAIL_DATA} />
        <ProjectDetailGallery data={PROJECT_DETAIL_DATA} />
        <ProjectDetailDescription data={PROJECT_DETAIL_DATA} />
        <ProjectDetailNav data={PROJECT_DETAIL_DATA} />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
