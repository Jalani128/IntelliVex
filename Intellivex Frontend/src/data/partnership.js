import story1 from "../assets/story1.png";
import suquare from "../assets/suquare.png";
import playIcon from "../assets/playicon.png";
import lgGlobe from "../assets/lg-h22.png";
import lgLeaf from "../assets/lg-h23.png";
import lgSquares from "../assets/lg-h24.png";
import logoWave from "../assets/testimonial1.png";
import logoOrange from "../assets/testimonial2.png";
import logoLgpsm from "../assets/testimonial3.png";
import searchIcon from "../assets/Search.png";
import mobileIcon from "../assets/Cellphone.png";
import cloudIcon from "../assets/Cloud data.png";

const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";

export const PARTNERSHIP_HEADER = {
  title: "Partnerships",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Partnerships" },
  ],
};

/* Section 1: Hero statement */
export const PASSION_SECTION = {
  eyebrow: "OVERVIEW",
  titleLine1: "Passion and innovation Shape",
  highlight: "our",
  titleTail: "Journey",
  description: LOREM_LONG,
  action: {
    label: "LET'S TALK TOGETHER",
    href: "/contact",
  },
};

/* Section 2: Technology & Strategic Partners + 4 logos */
export const STRATEGIC_PARTNERS = {
  eyebrow: "OVERVIEW",
  titleLine: "Technology & Strategic",
  highlight: "Partners",
  description: LOREM_LONG,
  logos: [
    { src: lgGlobe, alt: "Logoipsum Globe" },
    { src: lgLeaf, alt: "Logoipsum Leaf" },
    { src: lgSquares, alt: "Logoipsum Dots" },
    { src: lgLeaf, alt: "Logoipsum Leaf" },
  ],
};

/* Section 3: Partner / Integration Logos (3x2 Grid)
   Row 1: Wave (testimonial1), LGPSM (testimonial3), Orange (testimonial2)
   Row 2: LGPSM (testimonial3), Orange (testimonial2), Wave (testimonial1) */
export const INTEGRATION_LOGOS = {
  eyebrow: "OVERVIEW",
  titleLine: "Partner / Integration",
  highlight: "Logos",
  items: [
    { id: 1, name: "Cloud Partner", logo: logoWave, slug: "1" },
    { id: 2, name: "LGPSM", logo: logoLgpsm, slug: "2" },
    { id: 3, name: "Geometric Partner", logo: logoOrange, slug: "3" },
    { id: 4, name: "LGPSM", logo: logoLgpsm, slug: "4" },
    { id: 5, name: "Geometric Partner", logo: logoOrange, slug: "5" },
    { id: 6, name: "Cloud Partner", logo: logoWave, slug: "6" },
  ],
};

/* Section 4: Technology Integrations video container */
export const TECH_INTEGRATIONS = {
  eyebrow: "OVERVIEW",
  titleLine: "Technology",
  highlight: "Integrations",
  videoImage: suquare,
  playIcon: playIcon,
  videoAlt: "Technology Integrations Video",
};

/* Section 5: Platforms & Technologies Supported */
export const SUPPORTED_PLATFORMS = {
  eyebrow: "OVERVIEW",
  titleLine: "Platforms & Technologies",
  highlight: "Supported",
  action: {
    label: "VIEW ALL",
    href: "/services",
  },
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

/* Section 6: CTA Banner */
export const PARTNERSHIP_CTA = {
  titleLine1: "Become a Partner or Discuss",
  titleLine2: "Integration",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do",
  action: { label: "BECOME A PARTNER", href: "/contact" },
};

/* Existing details data preserved for backward compatibility */
export const DEFAULT_PARTNERSHIP_DATA = {
  eyebrow: "SERVICES OVERVIEW",
  titleLine1: "Empowering Businesses With Advanced",
  highlight: "Tech",
  titleTail: "Solutions",
  paragraphs: [
    LOREM_LONG,
    LOREM_SHORT,
    `${LOREM_LONG} Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.`,
  ],
  partnerLogoType: "geometric",

  successStory: {
    title: "Success Stories",
    paragraphs: [
      LOREM_LONG,
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as",
    ],
    image: {
      src: story1,
      alt: "Strategic enterprise technology partnership collaboration",
    },
  },
};

export const PARTNERS_BY_SLUG = {
  technology: { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "geometric" },
  cloud: { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "wave" },
  strategic: { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "lgpsm" },
  enterprise: { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "geometric" },
  "1": { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "wave" },
  "2": { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "lgpsm" },
  "3": { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "geometric" },
  "4": { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "lgpsm" },
  "5": { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "geometric" },
  "6": { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "wave" },
  wave: { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "wave" },
  lgpsm: { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "lgpsm" },
  geometric: { ...DEFAULT_PARTNERSHIP_DATA, partnerLogoType: "geometric" },
};

export function getPartnershipData(slug) {
  if (!slug) return DEFAULT_PARTNERSHIP_DATA;
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  return PARTNERS_BY_SLUG[normalized] || DEFAULT_PARTNERSHIP_DATA;
}
