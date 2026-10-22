import engineeringIcon from "../assets/Search.png";
import mobileIcon from "../assets/Cellphone.png";
import cloudIcon from "../assets/Cloud data.png";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  /* About Us is a page of its own, not a section of the home page. */
  { label: "About Us", href: "/about" },
  /* Services is a page of its own too; the dropdown deep-links into it. */
  {
    label: "Services",
    href: "/services",
    dropdown: [
      { label: "AI & Data Innovation", href: "/services/ai-data-innovation-ai-data-innovation" },
      { label: "Software Engineering", href: "/services/engineering" },
      { label: "Mobile Development", href: "/services/mobile-development" },
      { label: "Cloud & Cybersecurity", href: "/services/cloud-security" },
      { label: "Web Development", href: "/services/web-development" },
      { label: "Game Development", href: "/services/game-development" },
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
  stat: { value: "10+", label: "Years Of Experience" },
};

export const DIFFERENTIATORS = {
  eyebrow: "Why IntelliVex",
  title: "The IntelliVex",
  highlight: "Advantage",
  description:
    "We don’t just write code; we engineer outcomes. Our blend of technical depth, industry insight and a client-first mindset means every solution is future-proof, cost-efficient and built to deliver measurable business value from day one.",
  items: [
    "One partner, end-to-end: from strategy to support.",
    "AI-first thinking built into every solution.",
    "Dedicated AI, cloud and security specialists.",
    "Agile sprints with full, real-time visibility.",
    "Security-by-design, compliance-ready from day one.",
    "A long-term partnership that continues beyond go-live.",
  ],
};

export const SERVICES = {
  eyebrow: "Overview",
  title: "Capabilities That Drive",
  highlight: "Results",
  items: [
    {
      icon: engineeringIcon,
      title: "Software Engineering",
      description:
        "We engineer robust, cloud-native software tailored to your business, from architecture and APIs to deployment and long-term evolution.",
      tags: [
        "Custom Software Development",
        "Software Architecture & Microservices",
        "API Development & Integration",
        "DevOps & CI/CD",
        "QA & Test Automation",
        "Legacy Modernization",
      ],
      href: "/services/engineering",
    },
    {
      icon: mobileIcon,
      title: "Mobile Development",
      description:
        "We create high-performance, user-first mobile apps for iOS and Android that engage users, drive retention and grow revenue.",
      tags: [
        "Native iOS Development",
        "Native Android Development",
        "Cross-Platform Apps (Flutter & React Native)",
        "Mobile UI/UX Design",
        "App Maintenance & Support",
        "App Store Optimization (ASO)",
      ],
      href: "/services/mobile-development",
    },
    {
      icon: cloudIcon,
      title: "Cloud & Cybersecurity",
      description:
        "We architect secure, resilient cloud environments that protect your data, optimize costs and scale on demand.",
      tags: [
        "Cloud Migration & Modernization",
        "AWS, Azure & Google Cloud",
        "Cloud Architecture",
        "Cybersecurity Assessments & Audits",
        "Data Protection & Compliance",
        "Managed Cloud & FinOps",
      ],
      href: "/services/cloud-security",
    },
  ],
};

/* Heading of the Home "Projects" section; the cards come from GET /api/projects?home=1. */
export const PROJECTS = {
  eyebrow: "Portfolio",
  title: "Featured",
  highlight: "Projects",
};

export const CTA = {
  /* Figma breaks the headline after "your". */
  titleLine1: "Reimagine your",
  titleLine2: "business with Intellivex",
  description:
    "Let’s turn your ideas into intelligent, high-impact solutions. Talk to our experts and start building your competitive edge today.",
  action: { label: "Book a Free Consultation", href: "#contact" },
};

export const TESTIMONIALS = {
  eyebrow: "Testimonials",
  title: "Real",
  highlight: "Reviews",
};

export const FOOTER_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Help Center", href: "#help" },
  { label: "Contact Us", href: "/contact" },
];
