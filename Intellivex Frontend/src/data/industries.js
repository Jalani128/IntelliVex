import engineeringIcon from "../assets/Engineering.png";
import projectStationery from "../assets/project-1.png";
import projectBrandBook from "../assets/project-2.png";

const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";

export const INDUSTRIES_HEADER = {
  title: "Industries",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Industries" },
  ],
};

/* Section 1: Overview */
export const INDUSTRIES_OVERVIEW = {
  eyebrow: "WHAT WE CAN DO",
  titleLine1: "Empowering Industries for",
  highlight: "Tomorrow",
  titleTail: "Success",
  description: LOREM_LONG,
};

/* Section 2: Industries We Serve */
export const INDUSTRIES_SERVE = {
  eyebrow: "FOCUSED",
  titleLine1: "Industries",
  highlight: "We",
  titleTail: "Serve",
  items: [
    {
      id: "industry-1",
      icon: engineeringIcon,
      title: "Industry 1",
      description: LOREM_SHORT,
      action: { label: "DISCOVER", href: "/industries/details" },
    },
    {
      id: "industry-2",
      icon: engineeringIcon,
      title: "Industry 1",
      description: LOREM_SHORT,
      action: { label: "DISCOVER", href: "/industries/details" },
    },
    {
      id: "industry-3",
      icon: engineeringIcon,
      title: "Industry 1",
      description: LOREM_SHORT,
      action: { label: "DISCOVER", href: "/industries/details" },
    },
    {
      id: "industry-4",
      icon: engineeringIcon,
      title: "Industry 1",
      description: LOREM_SHORT,
      action: { label: "DISCOVER", href: "/industries/details" },
    },
  ],
};

/* Section 3: Featured Projects */
export const FEATURED_PROJECTS = {
  eyebrow: "RELEVANT CASE STUDIES",
  titleLine: "Featured",
  highlight: "Projects",
  action: {
    label: "VIEW ALL",
    href: "/portfolio",
  },
  cards: [
    {
      id: "project-1",
      badge: "Branding",
      title: "Intellivex",
      description: LOREM_SHORT,
      tags: ["Apps", "Stationery Items", "Letterhead"],
      action: { label: "VIEW DETAILS", href: "/portfolio/details" },
      image: projectStationery,
      imageAlt: "Intellivex Brand Stationery Project",
    },
    {
      id: "project-2",
      badge: "Branding",
      title: "Intellivex",
      description: LOREM_SHORT,
      tags: ["Apps", "Stationery Items", "Letterhead"],
      action: { label: "VIEW DETAILS", href: "/portfolio/details" },
      image: projectBrandBook,
      imageAlt: "Intellivex Brand Book Project",
    },
  ],
};

/* Section 4: CTA Banner */
export const INDUSTRIES_CTA = {
  titleLine1: "Ready to discuss your",
  titleLine2: "Industry Requirements?",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do",
  action: { label: "START A PROJECT", href: "/contact" },
};

