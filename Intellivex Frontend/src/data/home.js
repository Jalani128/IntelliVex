import engineeringIcon from "../assets/Search.png";
import mobileIcon from "../assets/Cellphone.png";
import cloudIcon from "../assets/Cloud data.png";
import logoipsumGlobe from "../assets/lg-h22.png";
import logoipsumLeaf from "../assets/lg-h23.png";
import logoipsumSquares from "../assets/lg-h24.png";
import projectStationery from "../assets/project-1.png";
import projectBrandBook from "../assets/project-2.png";

/* Copy mirrors the Figma home page, which is set in placeholder text. */
const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";
const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";
const LOREM_LINE = "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  /* About Us is a page of its own, not a section of the home page. */
  { label: "About Us", href: "/about" },
  /* Services is a page of its own too; the dropdown deep-links into it. */
  {
    label: "Services",
    href: "/services",
    dropdown: [
      { label: "Engineering", href: "/services" },
      { label: "Mobile Development", href: "/services" },
      { label: "Cloud & Security", href: "/services" },
    ],
  },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Partnerships", href: "/partnerships" },
];

export const HERO = {
  eyebrow: "Welcome to our creative solution",
  /* The Figma heading breaks after "Business" on desktop. */
  titleLine1: "Transform Your Business",
  titleLine2: "Through Strategic",
  highlight: "IT Solutions",
  description: LOREM_LONG,
  stat: { value: "10+", label: "Years Of Experience" },
  logos: [
    { src: logoipsumGlobe, alt: "Logoipsum" },
    { src: logoipsumLeaf, alt: "Logoipsum" },
    { src: logoipsumSquares, alt: "Logoipsum" },
    { src: logoipsumLeaf, alt: "Logoipsum" },
  ],
};

export const DIFFERENTIATORS = {
  eyebrow: "Why Choose Us",
  title: "Key",
  highlight: "Differentiators",
  description: LOREM_LONG,
  items: Array.from({ length: 6 }, () => LOREM_LINE),
};

export const SERVICES = {
  eyebrow: "Overview",
  title: "Our",
  highlight: "Services",
  items: [
    { icon: engineeringIcon, title: "Engineering", description: LOREM_SHORT, href: "#services" },
    { icon: mobileIcon, title: "Mobile Development", description: LOREM_SHORT, href: "#services" },
    { icon: cloudIcon, title: "Cloud & Security", description: LOREM_SHORT, href: "#services" },
  ],
};

export const PROJECTS = {
  eyebrow: "Portfolio",
  title: "Featured",
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

export const CTA = {
  /* Figma breaks the headline after "your". */
  titleLine1: "Reimagine your",
  titleLine2: "business with Intellivex",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do",
  action: { label: "Contact Us", href: "#contact" },
};

export const TESTIMONIALS = {
  eyebrow: "Testimonials",
  title: "Real",
  highlight: "Reviews",
  items: Array.from({ length: 3 }, () => ({
    rating: 5,
    quote: LOREM_SHORT,
    name: "Intellivex",
    role: "Business Solutions",
    initials: "IV",
  })),
};

export const FOOTER_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Help Center", href: "#help" },
  { label: "Contact Us", href: "/contact" },
];
