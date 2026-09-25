import engineeringIcon from "../assets/Search.png";
import mobileIcon from "../assets/Cellphone.png";
import cloudIcon from "../assets/Cloud data.png";
import webIcon from "../assets/webdev.png";
/* Exported as "cloud.png", but it is the brain mark that sits on Content
   Creation in the frame — Cloud & Security keeps "Cloud data.png". */
import contentIcon from "../assets/cloud.png";
import overviewImage from "../assets/services-overview.png";
import projectStationery from "../assets/project-1.png";
import projectBrandBook from "../assets/project-2.png";

/* Copy mirrors the Figma "Services" frame (node 182-99, 1440 wide), which is
   set in the same placeholder text as the rest of the file. */
const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";
const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";

export const SERVICES_HEADER = {
  title: "Services",
  breadcrumbs: [{ label: "Home", to: "/" }, { label: "Services" }],
};

/* The heading breaks after "Advanced", and only "Tech" takes the gradient —
   "Solutions" stays white. */
export const SERVICES_OVERVIEW = {
  eyebrow: "Services Overview",
  titleLine1: "Empowering Businesses With Advanced",
  highlight: "Tech",
  titleTail: "Solutions",
  paragraphs: [LOREM_LONG, LOREM_SHORT, `${LOREM_LONG} ${LOREM_SHORT}`],
  image: { src: overviewImage, alt: "Intellivex service delivery" },
};

export const SERVICE_CATALOG = {
  eyebrow: "Overview",
  title: "Our",
  highlight: "Services",
  /* Grid order follows the frame: the AI card opens the second row, ahead of
     Web Development and Content Creation. `variant` picks the component — the
     innovation cell carries no icon or description, just tag pills. */
  items: [
    { icon: engineeringIcon, title: "Engineering", description: LOREM_SHORT, href: "/services/details" },
    { icon: mobileIcon, title: "Mobile Development", description: LOREM_SHORT, href: "/services/details" },
    { icon: cloudIcon, title: "Cloud & Security", description: LOREM_SHORT, href: "/services/details" },
    {
      variant: "innovation",
      title: "AI &",
      highlight: "Data Innovation",
      tags: [
        "AI & Data Innovation",
        "Data Science",
        "Generative AI Consulting",
        "AI Agents",
        "AI Workshops",
        "AI Software Development",
        "Business Intelligence",
      ],
    },
    { icon: webIcon, title: "Web Development", description: LOREM_SHORT, href: "/services/details" },
    { icon: contentIcon, title: "Content Creation", description: LOREM_SHORT, href: "/services/details" },
  ],
};

export const RECENT_PROJECTS = {
  eyebrow: "Relevant Case Studies",
  title: "Recent",
  highlight: "Projects",
  items: [
    {
      badge: "Branding",
      title: "Intellivex",
      description: LOREM_SHORT,
      tags: ["Logo", "Stationery Items", "Letterhead"],
      image: projectStationery,
      href: "#portfolio",
    },
    {
      badge: "Branding",
      title: "Intellivex",
      description: LOREM_SHORT,
      tags: ["Logo", "Stationery Items", "Letterhead"],
      image: projectBrandBook,
      href: "#portfolio",
    },
  ],
};
