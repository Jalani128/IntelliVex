import product1 from "../assets/product1.png";
import product2 from "../assets/product2.png";
import searchIcon from "../assets/Search.png";
import mobileIcon from "../assets/Cellphone.png";
import cloudIcon from "../assets/Cloud data.png";
import engineeringIcon from "../assets/Engineering.png";

const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";

export const PRODUCTS_HEADER = {
  title: "Products",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Products" },
  ],
};

/* Section 1: Overview */
export const PRODUCTS_OVERVIEW = {
  eyebrow: "SERVICES OVERVIEW",
  titleLine1: "Innovative and modern IT",
  highlight: "Products",
  titleTail: "& solutions",
  description: LOREM_LONG,
};

/* Section 2: Featured Products */
export const FEATURED_PRODUCTS = {
  eyebrow: "OUR PRODUCTS",
  titleLine: "Featured",
  highlight: "Products",
  cards: [
    {
      id: "featured-1",
      badge: "Branding",
      title: "Intellivex",
      description: LOREM_SHORT,
      tags: ["Light", "User Experience", "Interface"],
      action: { label: "VIEW DETAILS", href: "/products/details" },
      image: product1,
      imageAlt: "Intellivex Dedicated IT & Marketing Platform",
    },
    {
      id: "featured-2",
      badge: "Branding",
      title: "Intellivex",
      description: LOREM_SHORT,
      tags: ["Light", "Technology Hub", "Interface"],
      action: { label: "VIEW DETAILS", href: "/products/details" },
      image: product2,
      imageAlt: "Intellivex Advanced POS and CRM Platform",
    },
  ],
};

/* Section 3: Solution Categories */
export const SOLUTION_CATEGORIES = {
  eyebrow: "POWERFUL TOPIC",
  titleLine: "Solution",
  highlight: "Categories",
  description: LOREM_LONG,
  categories: [
    "Software Development",
    "SaaS Products",
    "AI & Automation",
    "Mobile Applications",
    "Web Solutions",
  ],
};

/* Section 4: Ready-to-Deploy / Customizable Solutions */
export const CUSTOMIZABLE_SOLUTIONS = {
  eyebrow: "FOCUS ON",
  titleLine: "Ready-to-Deploy /",
  highlight: "Customizable Solutions",
  items: [
    {
      icon: searchIcon,
      title: "Engineering",
      description: LOREM_SHORT,
    },
    {
      icon: mobileIcon,
      title: "Mobile Development",
      description: LOREM_SHORT,
    },
    {
      icon: cloudIcon,
      title: "Cloud & Security",
      description: LOREM_SHORT,
    },
  ],
};

/* Section 5: Industries / Use Cases */
export const INDUSTRIES_USE_CASES = {
  eyebrow: "VERSATILE",
  titleLine: "Industries /",
  highlight: "Use Cases",
  action: {
    label: "VIEW ALL",
    href: "/industries",
  },
  items: [
    {
      id: "industry-1",
      icon: engineeringIcon,
      title: "Industry 1",
      description: LOREM_SHORT,
      action: { label: "READ MORE", href: "/industries/details" },
    },
    {
      id: "industry-2",
      icon: engineeringIcon,
      title: "Industry 1",
      description: LOREM_SHORT,
      action: { label: "READ MORE", href: "/industries/details" },
    },
  ],
};

/* Section 6: Product Showcase */
export const PRODUCT_SHOWCASE = {
  eyebrow: "OUR RECENT WORKS",
  titleLine: "Product",
  highlight: "Showcase",
  cards: [
    {
      id: "showcase-1",
      badge: "Branding",
      title: "Intellivex",
      description: LOREM_SHORT,
      tags: ["Light", "User Experience", "Interface"],
      action: { label: "VIEW DETAILS", href: "/products/details" },
      image: product1,
      imageAlt: "Intellivex Product Showcase 1",
    },
    {
      id: "showcase-2",
      badge: "Branding",
      title: "Intellivex",
      description: LOREM_SHORT,
      tags: ["Light", "Technology Hub", "Interface"],
      action: { label: "VIEW DETAILS", href: "/products/details" },
      image: product2,
      imageAlt: "Intellivex Product Showcase 2",
    },
  ],
};

/* Section 7: CTA Banner */
export const PRODUCTS_CTA = {
  titleLine1: "Become a Partner or Discuss",
  titleLine2: "Integration",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do",
  action: { label: "BECOME A PARTNER", href: "/contact" },
};
