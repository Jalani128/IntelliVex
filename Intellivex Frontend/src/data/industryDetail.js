import engineeringIcon from "../assets/Search.png";
import mobileIcon from "../assets/Cellphone.png";
import cloudIcon from "../assets/Cloud data.png";

const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";

const LOREM_LINE = "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

export const INDUSTRY_DETAIL_HEADER = {
  title: "Industry Details",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Industry Details" },
  ],
};

export const DEFAULT_INDUSTRY_DETAIL = {
  eyebrow: "WHAT WE CAN DO",
  titleLine: "Industry-Specific",
  highlight: "Solutions",
  paragraphs: [
    LOREM_LONG,
    LOREM_SHORT,
    `${LOREM_LONG} Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.`,
  ],

  challenges: {
    title: "Key Challenges We Solve",
    description: LOREM_LONG,
    items: [
      LOREM_LINE,
      LOREM_LINE,
      LOREM_LINE,
      LOREM_LINE,
    ],
  },

  caseStudies: {
    title: "Case Studies",
    paragraphs: [
      LOREM_LONG,
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as",
    ],
  },

  relevantServices: {
    eyebrow: "OVERVIEW",
    title: "Relevant",
    highlight: "Services",
    action: { label: "VIEW ALL", href: "/services" },
    items: [
      {
        icon: engineeringIcon,
        title: "Engineering",
        description: LOREM_SHORT,
        href: "/services/details",
      },
      {
        icon: mobileIcon,
        title: "Mobile Development",
        description: LOREM_SHORT,
        href: "/services/details",
      },
      {
        icon: cloudIcon,
        title: "Cloud & Security",
        description: LOREM_SHORT,
        href: "/services/details",
      },
    ],
  },

  cta: {
    titleLine1: "Ready to discuss your",
    titleLine2: "Industry Requirements?",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do",
    action: { label: "START A PROJECT", href: "/contact" },
  },
};

export const INDUSTRY_DETAILS_BY_SLUG = {
  finance: {
    ...DEFAULT_INDUSTRY_DETAIL,
    titleLine: "Financial Services &",
    highlight: "FinTech",
  },
  healthcare: {
    ...DEFAULT_INDUSTRY_DETAIL,
    titleLine: "Healthcare &",
    highlight: "Life Sciences",
  },
  retail: {
    ...DEFAULT_INDUSTRY_DETAIL,
    titleLine: "Retail &",
    highlight: "E-Commerce",
  },
  education: {
    ...DEFAULT_INDUSTRY_DETAIL,
    titleLine: "Education &",
    highlight: "EdTech",
  },
  logistics: {
    ...DEFAULT_INDUSTRY_DETAIL,
    titleLine: "Logistics &",
    highlight: "Supply Chain",
  },
  realestate: {
    ...DEFAULT_INDUSTRY_DETAIL,
    titleLine: "Real Estate &",
    highlight: "PropTech",
  },
};

export function getIndustryData(slug) {
  if (!slug) return DEFAULT_INDUSTRY_DETAIL;
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  return INDUSTRY_DETAILS_BY_SLUG[normalized] || DEFAULT_INDUSTRY_DETAIL;
}
