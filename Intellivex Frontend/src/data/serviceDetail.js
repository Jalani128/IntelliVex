import serviceImage from "../assets/serviceDetail.png";

/* Copy mirrors the Figma "Service Details" frame (node 186-621, 1440 × 2904),
   which is set in the same placeholder text as the rest of the file. */
const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";
const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";
const LOREM_LINE = "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

export const SERVICE_DETAIL_HEADER = {
  title: "Service Details",
  breadcrumbs: [{ label: "Home", to: "/" }, { label: "Service Details" }],
};

export const SERVICE_INTRO = {
  eyebrow: "Service",
  title: "AI &",
  highlight: "Data Innovation",
  paragraphs: [LOREM_LONG, LOREM_SHORT],
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
  description: LOREM_LONG,
  items: Array.from({ length: 4 }, () => LOREM_LINE),
};

export const SERVICE_FAQ = {
  title: "Frequently Asked Questions",
  items: [
    { question: "Lorem ipsum dolor sit amet consectetur adipiscing elit." },
    { question: "Lorem ipsum dolor sit amet elit." },
    { question: "Lorem ipsum dolor sit consectetur adipiscing elit." },
    { question: "Lorem ipsum dolor sit adipiscing elit." },
    { question: "Lorem ipsum dolor sit amet consectetur." },
    { question: "Loremamet consectetur adipiscing elit." },
  ].map((item) => ({ ...item, answer: `${LOREM_SHORT} ${LOREM_SHORT}` })),
};
