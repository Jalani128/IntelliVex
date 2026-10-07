/*
 * Client Portfolio Details page chrome. The client itself comes from
 * GET /api/clients/{slug} — see services/testimonials.js.
 */
export const CLIENT_PORTFOLIO_DETAIL_HEADER = {
  title: "Client Portfolio Details",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Testimonials", to: "/testimonials" },
    { label: "Client Portfolio Details" },
  ],
};

/* Eyebrow when the client has no industry label. */
export const CLIENT_EYEBROW = "OUR CLIENTS";

/* Headings of the related sections under the client's success story. */
export const RELATED_SECTIONS = {
  stories: { eyebrow: "CASE STUDIES", lead: "Related", highlight: "Stories" },
  reviews: { eyebrow: "TESTIMONIALS", lead: "What They", highlight: "Say" },
};
