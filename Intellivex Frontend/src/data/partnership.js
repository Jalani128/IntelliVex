import story1 from "../assets/story1.png";
import suquare from "../assets/suquare.png";
import playIcon from "../assets/playicon.png";
import searchIcon from "../assets/Search.png";
import mobileIcon from "../assets/Cellphone.png";
import cloudIcon from "../assets/Cloud data.png";

/* The Figma placeholder copy and "Logoipsum" logos were removed; sections without
   text or logos are hidden by the page until real content is added. */

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
  action: {
    label: "LET'S TALK TOGETHER",
    href: "/contact",
  },
};

/* Section 2: Technology & Strategic Partners — description and logo row */
export const STRATEGIC_PARTNERS = {
  eyebrow: "OVERVIEW",
  titleLine: "Technology & Strategic",
  highlight: "Partners",
  description: "",
  logos: [],
};

/* Section 3: Partner / Integration Logos (3x2 Grid) — { id, name, logo } */
export const INTEGRATION_LOGOS = {
  eyebrow: "OVERVIEW",
  titleLine: "Partner / Integration",
  highlight: "Logos",
  items: [],
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
    },
    {
      icon: mobileIcon,
      title: "Mobile Development",
    },
    {
      icon: cloudIcon,
      title: "Cloud & Security",
    },
  ],
};

/* Section 6: CTA Banner */
export const PARTNERSHIP_CTA = {
  titleLine1: "Become a Partner or Discuss",
  titleLine2: "Integration",
  action: { label: "BECOME A PARTNER", href: "/contact" },
};

/* Existing details data preserved for backward compatibility */
export const DEFAULT_PARTNERSHIP_DATA = {
  eyebrow: "SERVICES OVERVIEW",
  titleLine1: "Empowering Businesses With Advanced",
  highlight: "Tech",
  titleTail: "Solutions",
  paragraphs: [],
  partnerLogoType: "geometric",

  successStory: {
    title: "Success Stories",
    paragraphs: [],
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
