import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import PortfolioOverview from "../components/PortfolioOverview";
import CTABanner from "../components/CTABanner";
import PortfolioGrid from "../components/PortfolioGrid";
import Footer from "../components/Footer";
import { PORTFOLIO_HEADER, PROJECT_IMAGE_PLACEHOLDER } from "../data/portfolio";
import { fetchPortfolioPage, toPortfolioPage, toProjectCard } from "../services/portfolio";
import { useProjectList } from "../hooks/useProjectList";
import { usePageMeta } from "../hooks/usePageMeta";

/**
 * /portfolio — page content from GET /api/portfolio-page, projects from
 * GET /api/projects (filtered by the active category pill, paged by "Load More").
 */
export default function Portfolio() {
  const [page, setPage] = useState(null);
  const [pageFailed, setPageFailed] = useState(false);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchPortfolioPage()
      .then((data) => alive && setPage(toPortfolioPage(data)))
      .catch(() => alive && setPageFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  usePageMeta(page?.seo.title, page?.seo.description);

  const list = useProjectList(category);
  const cardOptions = { actionLabel: page?.cardButtonLabel, fallbackImage: PROJECT_IMAGE_PLACEHOLDER };
  const cards = useMemo(
    () => list.items.map((p) => toProjectCard(p, cardOptions)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list.items, page?.cardButtonLabel],
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Navbar />
      <main>
        <PageHeader
          title={PORTFOLIO_HEADER.title}
          breadcrumbs={PORTFOLIO_HEADER.breadcrumbs}
        />
        {/* Without page content the projects still load; the headings are left out. */}
        {!pageFailed && (
          <PortfolioOverview
            content={page?.overview}
            pills={page?.pills}
            active={category}
            onSelect={setCategory}
          />
        )}
        <PortfolioGrid
          content={page?.projects}
          list={{ ...list, items: cards }}
          loadMoreLabel={page?.loadMoreLabel}
          filtered={Boolean(category)}
        />
        {/* The CMS can switch the banner off; the default banner shows while it loads. */}
        {page ? page.cta && <CTABanner content={page.cta} /> : <CTABanner />}
      </main>
      <Footer />
    </div>
  );
}
