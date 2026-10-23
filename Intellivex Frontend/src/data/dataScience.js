import dataScienceImage from "../assets/dataScience.png";
import { serviceDetailFor } from "./serviceDetails";

/* Layout mirrors the Figma "Data Science" frame (node 198-1090, 1440 wide); the
   body copy is the "Data Science & Business Intelligence" service document. */
const DOC = serviceDetailFor("AI & Data Innovation", "Data Science & Business Intelligence");

export const DATA_SCIENCE_HEADER = {
  title: "Data Science",
  breadcrumbs: [{ label: "Home", to: "/" }, { label: "Data Science" }],
};

/* No sibling pills on this frame — the photo runs the full 1060 column. */
export const DATA_SCIENCE_INTRO = {
  eyebrow: "Service",
  title: "Data",
  highlight: "Science",
  paragraphs: DOC.intro,
  image: {
    src: dataScienceImage,
    alt: "Neural network layers over source code",
    width: 1061,
    height: 409,
  },
};

export const DATA_SCIENCE_BENEFITS = {
  title: "Our Benefits",
  description: DOC.benefits.description,
  items: DOC.benefits.items,
};

export const CONSULTATION = {
  eyebrow: "Get Consultations",
  title: "Ready To Get Free",
  highlight: "Consultations",
  contact: {
    title: "Contact Us",
    lines: [
      { text: "+994 10 243 9644", href: "tel:+994102439644" },
      { text: "+994 10 243 9645", href: "tel:+994102439645" },
      { text: "info@theintellivex.com", href: "mailto:info@theintellivex.com" },
    ],
  },
  address: {
    title: "Address Business",
    lines: [
      { text: "AZ1025, BAKI ŞƏHƏRİ XƏTAİ RAYONU," },
      { text: "8 NOYABR, ev.15, AZURE BUSINESS CENTER, m. 165B" },
    ],
  },
  form: {
    title: "Get Free Consultation",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", autoComplete: "name" },
      { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
      { name: "email", label: "Email", type: "email", autoComplete: "email" },
      { name: "subject", label: "Subject", type: "text" },
    ],
    message: "Write Message",
    action: "Get Consultation",
  },
};
