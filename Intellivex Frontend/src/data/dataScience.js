import dataScienceImage from "../assets/dataScience.png";

/* Copy mirrors the Figma "Data Science" frame (node 198-1090, 1440 wide). The
   body copy is placeholder text; the contact block is real. */
const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";
const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";
const LOREM_LINE = "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

export const DATA_SCIENCE_HEADER = {
  title: "Data Science",
  breadcrumbs: [{ label: "Home", to: "/" }, { label: "Data Science" }],
};

/* No sibling pills on this frame — the photo runs the full 1060 column. */
export const DATA_SCIENCE_INTRO = {
  eyebrow: "Service",
  title: "Data",
  highlight: "Science",
  paragraphs: [LOREM_LONG, LOREM_SHORT],
  image: {
    src: dataScienceImage,
    alt: "Neural network layers over source code",
    width: 1061,
    height: 409,
  },
};

export const DATA_SCIENCE_BENEFITS = {
  title: "Our Benefits",
  description: LOREM_LONG,
  items: Array.from({ length: 4 }, () => LOREM_LINE),
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
      { name: "fullName", label: "Full Name", type: "text", autoComplete: "name" },
      { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
      { name: "email", label: "Email", type: "email", autoComplete: "email" },
      { name: "subject", label: "Subject", type: "text" },
    ],
    message: "Write Message",
    action: "Get Consultation",
  },
};
