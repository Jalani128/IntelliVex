import engineeringIcon from "../assets/Engineering.png";

/*
 * Industries page chrome. Headings, industry cards, featured projects, CTA and
 * SEO come from the API (GET /api/industries-page) — see services/industries.js.
 */
export const INDUSTRIES_HEADER = {
  title: "Industries",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Industries" },
  ],
};

/* Small labels above each section's heading (the API has no eyebrow per section). */
export const SECTION_EYEBROWS = {
  overview: "WHAT WE CAN DO",
  industries: "FOCUSED",
  featuredProjects: "RELEVANT CASE STUDIES",
};

/* Featured Projects: card link label and the "VIEW ALL" button. */
export const FEATURED_PROJECTS = {
  cardActionLabel: "VIEW DETAILS",
  action: { label: "VIEW ALL", href: "/portfolio" },
};

/* Shown for industries without an icon. */
export const INDUSTRY_ICON_FALLBACK = engineeringIcon;
