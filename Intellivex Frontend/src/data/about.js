import logoipsumPinwheel from "../assets/lg-h23.png";
import { CTA, DIFFERENTIATORS } from "./home";

export const ABOUT_HEADER = {
  title: "About Us",
  breadcrumbs: [{ label: "Home", to: "/" }, { label: "About Us" }],
};

export const OVERVIEW = {
  eyebrow: "WHO WE ARE",
  title: "Engineering Intelligent Solutions for",
  highlight: "What’s Next",
  paragraphs: [
    "IntelliVex Technologies is a full-stack digital engineering company that turns bold ideas into market-ready products. We pair deep engineering expertise with design thinking to build technology that moves your business forward, not just technology that works.",
    "AI. Cloud. Apps. Games. One partner, engineered for impact.",
    "Our multidisciplinary team of engineers, designers, data scientists and business consultants partners with organizations across healthcare, finance, retail, education, logistics and entertainment. We believe technology should do more than function; it should transform how industries operate, compete, and grow. That is why every engagement is built on three non-negotiables: it must be intelligent, it must be secure, and it must deliver measurable ROI for our clients and the communities they serve.",
  ],
  partners: {
    title: "Trusted",
    highlight: "Partners",
    description:
      "From fast-moving startups to global enterprises, organizations choose IntelliVex for innovation they can rely on and delivery they can count on.",
    rating: 5,
    logo: { src: logoipsumPinwheel, alt: "Logoipsum" },
  },
  pillars: [
    {
      title: "Our",
      highlight: "Vision",
      description:
        "To become a catalyst for the intelligent digital transformation of businesses worldwide—where technology, AI and human ingenuity turn complex challenges into new possibilities.",
    },
    {
      title: "Our",
      highlight: "Mission",
      description:
        "To empower businesses with intelligent, secure and future-proof digital solutions that solve real problems and unlock new growth. Through AI, cloud, custom software and immersive digital experiences, we turn complexity into competitive advantage and deliver results our clients can measure.",
    },
  ],
};

export const PROCESS = {
  eyebrow: "OUR PROCESS",
  title: "From Idea to",
  highlight: "Impact",
  description:
    "Great technology starts with a clear process. Our proven three-phase delivery model keeps you in control at every stage, from the first conversation to launch day and beyond. The result: faster time-to-market, full transparency and a solution built around your goals.",
  steps: [
    {
      step: "STEP 1",
      title: "Discover & Strategize",
      description:
        "We dive deep into your business, users and goals to define a clear strategy and a roadmap built for success.",
      offset: 253,
    },
    {
      step: "STEP 2",
      title: "Build & Iterate",
      description:
        "We design, build and test in agile sprints, with regular demos so your feedback shapes every feature.",
      offset: 159,
    },
    {
      step: "STEP 3",
      title: "Launch & Scale",
      description:
        "We launch, monitor and continuously optimize your solution, so it scales with your business and keeps delivering value.",
      offset: 0,
    },
  ],
};

/* Same block and copy as the home page. */
export const ABOUT_DIFFERENTIATORS = DIFFERENTIATORS;

/* "Our Leadership" heading shown while GET /api/team-section loads (or if it fails);
   the heading, VIEW ALL button and members all come from the API. Matches the API defaults. */
export const LEADERSHIP_HEADING = {
  eyebrow: "TEAM MEMBERS",
  title: "Our",
  highlight: "Leadership",
};

/* Same banner copy as the home page; only the button target differs. */
export const ABOUT_CTA = {
  ...CTA,
  action: { ...CTA.action, href: "/contact" },
};
