import serviceImage from "../assets/serviceDetail.png";
import { serviceDetailFor } from "./serviceDetails";

/* Layout mirrors the Figma "Service Details" frame (node 186-621, 1440 × 2904);
   the copy is the AI & Data Innovation service document. */
const AI_DOC = serviceDetailFor("AI & Data Innovation");

export const SERVICE_DETAIL_HEADER = {
  title: "Service Details",
  breadcrumbs: [{ label: "Home", to: "/" }, { label: "Service Details" }],
};

export const SERVICE_INTRO = {
  eyebrow: "Service",
  title: "AI &",
  highlight: "Data Innovation",
  paragraphs: AI_DOC.intro,
  /* The first pill is the service being viewed; the rest are its siblings. */
  tags: [
    { label: "AI & Data Innovation", active: true },
    { label: "Data Science", to: "/services/data-science" },
    { label: "Generative AI Consulting" },
    { label: "AI Agents" },
    { label: "AI Workshops" },
    { label: "AI Software Development" },
    { label: "Business Intelligence" },
  ],
  /* Placed at its native size in the frame, right-aligned to the column. */
  image: { src: serviceImage, alt: "AI and data innovation in practice", width: 651, height: 409 },
};

export const SERVICE_BENEFITS = {
  title: "Our Benefits",
  description: AI_DOC.benefits.description,
  items: AI_DOC.benefits.items,
};

export const SERVICE_FAQ = {
  title: "Frequently Asked Questions",
  items: AI_DOC.faqs,
};
