import projectStationery from "../assets/project-1.png";
import projectBrandBook from "../assets/project-2.png";

const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";
const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";

export const PORTFOLIO_HEADER = {
  title: "Portfolio",
  breadcrumbs: [{ label: "Home", to: "/" }, { label: "Portfolio" }],
};

export const PORTFOLIO_BEST_FEATURES = {
  eyebrow: "OUR RECENT WORKS",
  titleLine: "Best Features Provided By",
  highlight: "Intellivex",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla os faucibus ready pulvinar vulputate neque, semper. Ornare non nulla.",
  pills: [
    "Software Development",
    "SaaS Products",
    "AI & Automation",
    "Mobile Applications",
    "Web Solutions",
  ],
};

/* Backwards compatibility alias */
export const PORTFOLIO_OVERVIEW = PORTFOLIO_BEST_FEATURES;

export const PORTFOLIO_RECENT_PROJECTS = {
  eyebrow: "RELEVANT CASE STUDIES",
  title: "Recent",
  highlight: "Projects",
  items: [
    {
      id: "project-1",
      badge: "Branding",
      title: "Intellivex",
      description: LOREM_SHORT,
      tags: ["Logo", "Stationery Items", "Letterhead"],
      image: projectStationery,
      href: "/portfolio/details",
    },
    {
      id: "project-2",
      badge: "Branding",
      title: "Intellivex",
      description: LOREM_SHORT,
      tags: ["Logo", "Stationery Items", "Letterhead"],
      image: projectBrandBook,
      href: "/portfolio/details",
    },
  ],
};

/* Backwards compatibility alias */
export const PORTFOLIO_PROJECTS = PORTFOLIO_RECENT_PROJECTS;
