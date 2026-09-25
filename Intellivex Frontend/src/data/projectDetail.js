import heroImage from "../assets/prjectD.png";
import mockupLeft from "../assets/project-1.png";
import mockupRight from "../assets/project-1.png";

const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";

const LOREM_LINE = "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

export const PROJECT_DETAIL_HEADER = {
  title: "Project Details",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Project Details" },
  ],
};

export const PROJECT_DETAIL_DATA = {
  eyebrow: "OUR RECENT WORKS",
  titleLine: "Best Features Provided By",
  highlight: "Intellivex",
  description: LOREM_LONG,

  clientLabel: "Client / Industry",
  clientValue: "Intellivex",
  tags: ["Logo", "Stationery Items", "Letterhead"],

  images: {
    hero: {
      src: heroImage,
      alt: "Intellivex Stationery, Letterhead, and Business Card Showcase",
    },
    gallery: [
      {
        src: mockupLeft,
        alt: "Intellivex Letterhead and Business Card Perspective Mockup",
      },
      {
        src: mockupRight,
        alt: "Intellivex Stationery Suite Layout Mockup",
      },
    ],
  },

  challenge: {
    title: "The challenge of project",
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

  navigation: {
    prev: {
      label: "Previous Project",
      to: "/portfolio",
    },
    next: {
      label: "Next Project",
      to: "/portfolio",
    },
  },
};
