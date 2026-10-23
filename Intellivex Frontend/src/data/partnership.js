import story1 from "../assets/story1.png";
import suquare from "../assets/suquare.png";
import playIcon from "../assets/playicon.png";
import searchIcon from "../assets/Search.png";
import mobileIcon from "../assets/Cellphone.png";
import cloudIcon from "../assets/Cloud data.png";

/* Copy from "Intellivex Partnerships Page Content" (4 sections: overview,
   platforms, capabilities, CTA). Sections the document doesn't cover are hidden. */

export const PARTNERSHIP_HEADER = {
  title: "Partnerships",
  breadcrumbs: [
    { label: "Home", to: "/" },
    { label: "Partnerships" },
  ],
};

/* Section 1: Hero / Overview */
export const PASSION_SECTION = {
  eyebrow: "PARTNER WITH INTELLIVEX",
  titleLine1: "Better Technology,",
  highlight: "Built Together",
  titleTail: "",
  description:
    "We team up with software vendors, agencies and platform providers to deliver solutions none of us could build as well alone. You bring your product or your clients; we bring dependable engineering, clear communication and long-term support.",
  action: {
    label: "LET'S TALK PARTNERSHIP",
    href: "/contact",
  },
};

/*
 * Section 2: Platforms we build on. Keep the heading as "Platforms We Build On"
 * until Intellivex holds an official partner status (e.g. an AWS Partner Network
 * listing); then it can become "Our Technology Partners" with the official badge.
 * `platforms` lists tools by name — add `logos` ({ src, alt }) only with official
 * logo files, following each brand's logo rules.
 */
export const STRATEGIC_PARTNERS = {
  eyebrow: "OUR ECOSYSTEM",
  titleLine: "The Platforms",
  highlight: "We Build On",
  description:
    "We work with proven, widely trusted platforms so your product rests on a stable, secure foundation. Our approach is pragmatic: we pick the tools that suit your goals and budget, not whatever is trending this month.",
  platforms: [
    { category: "Cloud", names: ["AWS", "Microsoft Azure", "Google Cloud"] },
    { category: "Web & mobile", names: ["React", "Node.js", "Flutter"] },
    { category: "DevOps", names: ["Docker", "Kubernetes", "GitHub"] },
    { category: "Business tools", names: ["Stripe", "Shopify", "HubSpot"] },
  ],
  logos: [],
};

/* Section 3: Partner / Integration Logos (3x2 Grid) — { id, name, logo } */
export const INTEGRATION_LOGOS = {
  eyebrow: "OVERVIEW",
  titleLine: "Partner / Integration",
  highlight: "Logos",
  items: [],
};

/* Section 4: Technology Integrations video container — not in the content document,
   and there is no video yet, so it is hidden. Set `show: true` once a video exists. */
export const TECH_INTEGRATIONS = {
  show: false,
  eyebrow: "OVERVIEW",
  titleLine: "Technology",
  highlight: "Integrations",
  videoImage: suquare,
  playIcon: playIcon,
  videoAlt: "Technology Integrations Video",
};

/* Section 5: Capabilities cards */
export const SUPPORTED_PLATFORMS = {
  eyebrow: "WHAT WE BRING",
  titleLine: "Expertise That",
  highlight: "Powers Integration",
  action: {
    label: "VIEW ALL SERVICES",
    href: "/services",
  },
  items: [
    {
      icon: searchIcon,
      title: "Custom Engineering",
      description:
        "Robust web applications, APIs and backend systems built on clean, well-documented code, so your integration stays easy to maintain as you grow.",
    },
    {
      icon: mobileIcon,
      title: "Mobile Development",
      description:
        "Native and cross-platform apps for iOS and Android, designed for smooth performance and connected to the services your users rely on.",
    },
    {
      icon: cloudIcon,
      title: "Cloud & Security",
      description:
        "Cloud setup, migration and support with security built in from day one, following best practices for access control and data protection.",
    },
  ],
};

/* Section 6: CTA Banner */
export const PARTNERSHIP_CTA = {
  titleLine1: "Let's Build Something",
  titleLine2: "Great Together",
  description:
    "Are you a software company, agency or SaaS platform looking for a reliable development partner? Let's talk about integrations, referrals or joint projects.",
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
