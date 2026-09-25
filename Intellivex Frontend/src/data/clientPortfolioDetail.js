import story1 from "../assets/story1.png";

const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";

export const CLIENT_PORTFOLIO_DETAIL_HEADER = {
  title: "Client Portfolio Details",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Client Portfolio Details" },
  ],
};

export const DEFAULT_CLIENT_PORTFOLIO_DETAIL = {
  eyebrow: "SERVICES OVERVIEW",
  titleLine1: "Empowering Businesses With Advanced",
  highlight: "Tech",
  titleTail: "Solutions",
  paragraphs: [
    LOREM_LONG,
    LOREM_SHORT,
    `${LOREM_LONG} Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.`,
  ],
  clientLogoType: "geometric",

  successStory: {
    title: "Success Stories",
    paragraphs: [
      LOREM_LONG,
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as",
    ],
    image: {
      src: story1,
      alt: "Modern collaborative enterprise office with panoramic city views",
    },
  },
};

export const CLIENT_PORTFOLIO_BY_SLUG = {
  "1": {
    ...DEFAULT_CLIENT_PORTFOLIO_DETAIL,
    clientLogoType: "wave",
  },
  "2": {
    ...DEFAULT_CLIENT_PORTFOLIO_DETAIL,
    clientLogoType: "lgpsm",
  },
  "3": {
    ...DEFAULT_CLIENT_PORTFOLIO_DETAIL,
    clientLogoType: "geometric",
  },
  "4": {
    ...DEFAULT_CLIENT_PORTFOLIO_DETAIL,
    clientLogoType: "lgpsm",
  },
  "5": {
    ...DEFAULT_CLIENT_PORTFOLIO_DETAIL,
    clientLogoType: "geometric",
  },
  "6": {
    ...DEFAULT_CLIENT_PORTFOLIO_DETAIL,
    clientLogoType: "wave",
  },
  wave: {
    ...DEFAULT_CLIENT_PORTFOLIO_DETAIL,
    clientLogoType: "wave",
  },
  lgpsm: {
    ...DEFAULT_CLIENT_PORTFOLIO_DETAIL,
    clientLogoType: "lgpsm",
  },
  geometric: {
    ...DEFAULT_CLIENT_PORTFOLIO_DETAIL,
    clientLogoType: "geometric",
  },
};

export function getClientPortfolioData(slug) {
  if (!slug) return DEFAULT_CLIENT_PORTFOLIO_DETAIL;
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  return CLIENT_PORTFOLIO_BY_SLUG[normalized] || DEFAULT_CLIENT_PORTFOLIO_DETAIL;
}
