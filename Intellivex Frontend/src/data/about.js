import teamCurly from "../assets/Ellipse 9.png";
import teamBlonde from "../assets/Ellipse 9 (1).png";
import teamShirt from "../assets/Ellipse 9 (2).png";
import logoipsumPinwheel from "../assets/lg-h23.png";

const LOREM_LONG =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.";
const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper.";
const LOREM_LINE = "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

export const ABOUT_HEADER = {
  title: "About Us",
  breadcrumbs: [{ label: "Home", to: "/" }, { label: "About Us" }],
};

export const OVERVIEW = {
  eyebrow: "WHAT WE CAN DO",
  title: "Building Future-Ready Solutions for",
  highlight: "Today's Challenges",
  paragraphs: [
    LOREM_LONG,
    LOREM_SHORT,
    `${LOREM_LONG} Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam dolor nunc semper. Ornare non nulla as faucibus ready pulvinar vulputate neque..semper. Ornare non nulla.`,
  ],
  partners: {
    title: "Trusted",
    highlight: "Partners",
    description: LOREM_SHORT,
    rating: 5,
    logo: { src: logoipsumPinwheel, alt: "Logoipsum" },
  },
  pillars: [
    { title: "Our", highlight: "Vision", description: `${LOREM_SHORT} ${LOREM_SHORT}` },
    { title: "Our", highlight: "Mission", description: `${LOREM_SHORT} ${LOREM_SHORT}` },
  ],
};

export const PROCESS = {
  eyebrow: "OUR PROCESS",
  title: "How We",
  highlight: "Deliver",
  description: `${LOREM_SHORT} ${LOREM_SHORT}`,
  steps: [
    { step: "STEP 1", title: "Discover your Vision", description: LOREM_SHORT, offset: 253 },
    { step: "STEP 2", title: "Refine Through Feedback", description: LOREM_SHORT, offset: 159 },
    { step: "STEP 3", title: "Deliver Lasting Impact", description: LOREM_SHORT, offset: 0 },
  ],
};

export const ABOUT_DIFFERENTIATORS = {
  eyebrow: "WHY CHOOSE US",
  title: "Key",
  highlight: "Differentiators",
  description: LOREM_LONG,
  items: Array.from({ length: 6 }, () => LOREM_LINE),
};

export const LEADERSHIP = {
  eyebrow: "TEAM MEMBERS",
  title: "Our",
  highlight: "Leadership",
  action: { label: "VIEW ALL", href: "/contact" },
  team: [
    { name: "Full Name", role: "Developer", image: teamCurly, alt: "Intellivex team member" },
    { name: "Full Name", role: "Developer", image: teamBlonde, alt: "Intellivex team member" },
    { name: "Full Name", role: "Developer", image: teamShirt, alt: "Intellivex team member" },
  ],
};

export const ABOUT_CTA = {
  titleLine1: "Reimagine your",
  titleLine2: "business with Intellivex",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer quam do",
  action: { label: "START A PROJECT", href: "/contact" },
};

