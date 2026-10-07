import storyPlaceholder from "../assets/story1.png";

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
