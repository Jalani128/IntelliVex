import serviceIcon from "../assets/Search.png";

/*
 * Industry Details page chrome. The industry itself comes from
 * GET /api/industries/{slug} — see services/industries.js.
 */
export const INDUSTRY_DETAIL_HEADER = {
  title: "Industry Details",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Industries", to: "/industries" },
    { label: "Industry Details" },
  ],
};

/* "Relevant Services" heading (the cards come from the industry's linked services). */
export const RELEVANT_SERVICES = {
  eyebrow: "OVERVIEW",
  title: "Relevant",
  highlight: "Services",
  action: { label: "VIEW ALL", href: "/services" },
};

/* Shown for services without an icon. */
export const SERVICE_ICON_FALLBACK = serviceIcon;
