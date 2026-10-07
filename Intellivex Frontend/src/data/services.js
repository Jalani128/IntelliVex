import engineeringIcon from "../assets/Search.png";
import mobileIcon from "../assets/Cellphone.png";
import cloudIcon from "../assets/Cloud data.png";
import webIcon from "../assets/webdev.png";
/* Exported as "cloud.png", but it is the brain mark from the last card in the
   frame — Cloud & Cybersecurity keeps "Cloud data.png". */
import gameIcon from "../assets/cloud.png";
import overviewImage from "../assets/services-overview.png";

export const SERVICES_HEADER = {
  title: "Services",
  breadcrumbs: [{ label: "Home", to: "/" }, { label: "Services" }],
};

/* The heading breaks after "That" on desktop, and "Powers Growth" takes the gradient. */
export const SERVICES_OVERVIEW = {
  eyebrow: "What We Do",
  titleLine1: "Next-Gen Technology That",
  highlight: "Powers Growth",
  paragraphs: [
    "At IntelliVex, we deliver a complete spectrum of technology services designed to help businesses innovate faster, scale smarter and lead their markets. Whatever the challenge, our experts engineer the right solution for your goals.",
    "Technological capabilities. One accountable partner. Zero silos.",
    "Our capabilities span artificial intelligence and data science, custom software engineering, web and mobile app development, cloud infrastructure and cybersecurity, and immersive game development. Every engagement is led by specialists who speak the language of both technology and business. Whether you are a startup launching your first product or an enterprise modernizing legacy systems, we deliver solutions that grow with you.",
  ],
  image: { src: overviewImage, alt: "Intellivex service delivery" },
};

/* Static AI & Data Innovation card — always the first card of the Services
   page grid, whatever the API sends. No icon or description, just tag pills. */
export const AI_INNOVATION_CARD = {
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
};

export const SERVICE_CATALOG = {
  eyebrow: "Overview",
  title: "Capabilities That Drive",
  highlight: "Results",
  /* The AI & Data Innovation card (AI_INNOVATION_CARD) is static and always
     comes first; these are the other cards. Every card lists its sub-services
     as tag pills. */
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
      href: "/services/details",
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
      href: "/services/details",
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
      href: "/services/details",
    },
    {
      icon: webIcon,
      title: "Web Development",
      description:
        "We build fast, secure, conversion-focused websites and web apps that deliver seamless experiences on every device.",
      tags: [
        "Custom Web Applications",
        "E-Commerce Development",
        "CMS Development",
        "Progressive Web Apps (PWA)",
        "Web UI/UX Design",
        "Website Care & Maintenance",
      ],
      href: "/services/details",
    },
    {
      /* No game icon has been supplied yet; this card keeps the existing mark. */
      icon: gameIcon,
      title: "Game Development",
      description:
        "We craft immersive, engaging games for mobile, web and PC, from creative concept to global launch and LiveOps.",
      tags: [
        "Mobile Game Development",
        "Multiplayer & Online Games",
        "2D & 3D Game Art & Design",
        "Unity Development",
        "LiveOps & Post-Launch Updates",
        "Gamification & Educational Games",
      ],
      href: "/services/details",
    },
  ],
};

/* Heading of "Recent Projects"; the cards are the first published projects from the API. */
export const RECENT_PROJECTS = {
  eyebrow: "Relevant Case Studies",
  title: "Recent",
  highlight: "Projects",
};
