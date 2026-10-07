import projectPlaceholder from "../assets/project-1.png";

/*
 * Portfolio page chrome. Projects, category pills, headings, CTA and SEO all
 * come from the API (GET /api/portfolio-page, /api/projects) — see services/portfolio.js.
 */
export const PORTFOLIO_HEADER = {
  title: "Portfolio",
  breadcrumbs: [{ label: "Home", to: "/" }, { label: "Portfolio" }],
};

/* Shown for projects that have no card image yet. */
export const PROJECT_IMAGE_PLACEHOLDER = projectPlaceholder;
