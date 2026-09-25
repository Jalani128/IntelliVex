import logoipsumGlobe from "../assets/lg-h22.png";
import logoipsumLeaf from "../assets/lg-h23.png";
import logoipsumSquares from "../assets/lg-h24.png";
import story1 from "../assets/story1.png";
import story2 from "../assets/story2.png";
import story3 from "../assets/story3.png";

const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";

export const TESTIMONIALS_HEADER = {
  title: "Testimonials",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Testimonials" },
  ],
};

export const TESTIMONIALS_LOGOS = [
  { src: logoipsumGlobe, alt: "Logoipsum Globe" },
  { src: logoipsumLeaf, alt: "Logoipsum Leaf" },
  { src: logoipsumSquares, alt: "Logoipsum Squares" },
  { src: logoipsumLeaf, alt: "Logoipsum Leaf" },
];

export const CLIENT_PORTFOLIO_DATA = {
  eyebrow: "OUR CLIENTS",
  titleLine: "Client",
  highlight: "Portfolio",
  paragraphs: [
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.",
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.",
  ],
  clients: [
    { id: 1, type: "wave", name: "Company Name" },
    { id: 2, type: "lgpsm", name: "Company Name" },
    { id: 3, type: "geometric", name: "Company Name" },
    { id: 4, type: "lgpsm", name: "Company Name" },
    { id: 5, type: "geometric", name: "Company Name" },
    { id: 6, type: "wave", name: "Company Name" },
  ],
};

export const REAL_REVIEWS_DATA = {
  eyebrow: "TESTIMONIALS",
  titleLine: "Real",
  highlight: "Reviews",
  items: [
    {
      rating: 5,
      quote:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.",
      name: "Intellivex",
      role: "Business Solutions",
      initials: "IV",
    },
    {
      rating: 5,
      quote:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.",
      name: "Intellivex",
      role: "Business Solutions",
      initials: "IV",
    },
    {
      rating: 5,
      quote:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.",
      name: "Intellivex",
      role: "Business Solutions",
      initials: "IV",
    },
  ],
};

export const SUCCESS_STORIES_DATA = {
  eyebrow: "TESTIMONIALS",
  titleLine: "Success",
  highlight: "Stories",
  featured: [
    {
      id: "story-1",
      image: story1,
      title: "Lorem ipsum dolor sit amet consectetur",
      href: "/portfolio/details",
    },
    {
      id: "story-2",
      image: story2,
      title: "Lorem ipsum dolor sit amet consectetur",
      href: "/portfolio/details",
    },
  ],
  items: [
    {
      id: "story-3",
      image: story1,
      title: "Lorem ipsum dolor sit amet consectetur",
      href: "/portfolio/details",
    },
    {
      id: "story-4",
      image: story2,
      title: "Lorem ipsum dolor sit amet consectetur",
      href: "/portfolio/details",
    },
    {
      id: "story-5",
      image: story3,
      title: "Lorem ipsum dolor sit amet consectetur",
      href: "/portfolio/details",
    },
  ],
};

export const TESTIMONIALS_CTA = {
  titleLine1: "Ready to discuss your",
  titleLine2: "Industry Requirements?",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do",
  action: { label: "START A PROJECT", href: "/contact" },
};
