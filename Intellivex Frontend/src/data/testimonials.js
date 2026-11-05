import storyPlaceholder from "../assets/story1.png";
import healthcareArt from "../assets/stories/healthcare.svg";
import financeArt from "../assets/stories/finance.svg";
import realEstateArt from "../assets/stories/real-estate.svg";
import logisticsArt from "../assets/stories/logistics.svg";
import educationArt from "../assets/stories/education.svg";

/*
 * Testimonials page chrome. Client logos, Client Portfolio, reviews, success
 * stories, headings, CTA and SEO come from the API (GET /api/testimonials-page)
 * — see services/testimonials.js.
 */
export const TESTIMONIALS_HEADER = {
  title: "Testimonials",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Testimonials" },
  ],
};

/* Small labels above each section's heading (the API has no eyebrow per section). */
export const SECTION_EYEBROWS = {
  clients: "OUR CLIENTS",
  reviews: "TESTIMONIALS",
  stories: "TESTIMONIALS",
};

/* Shown for success stories without an image. */
export const STORY_IMAGE_PLACEHOLDER = storyPlaceholder;

/* Industry illustrations for stories without an uploaded image, matched on the
   story title and client name. First match wins. */
const STORY_ILLUSTRATIONS = [
  { image: healthcareArt, keywords: /health|care|medic|clinic|hospital|patient|pharma/i },
  { image: financeArt, keywords: /financ|bank|wallet|payment|fintech|invest|insur/i },
  { image: realEstateArt, keywords: /propert|real estate|realty|home|housing|nest/i },
  { image: logisticsArt, keywords: /logistic|route|fleet|shipping|delivery|freight|transport|supply/i },
  { image: educationArt, keywords: /educat|learn|school|student|course|academ|training/i },
];

/** The illustration that fits a story's text, or null. */
export const storyIllustrationFor = (text) => STORY_ILLUSTRATIONS.find((s) => s.keywords.test(text ?? ""))?.image ?? null;
