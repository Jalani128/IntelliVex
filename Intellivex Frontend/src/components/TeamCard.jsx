import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

/* The Figma frame lights the middle handle on every card, so the row of three
   reads as one brand accent rather than three grey chips. */
const SOCIALS = [
  { Icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
  { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com", accent: true },
  { Icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
];

/**
 * A 321 × 428 leadership plate: portrait, name, role and the three social
 * handles that close the "Our Leadership" row.
 */
export default function TeamCard({ name, role, image, alt, delay = 0 }) {
  return (
    <motion.article
      className="surface-card group relative overflow-hidden px-6 pb-12 pt-10 text-center transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-[0_28px_60px_-24px_rgba(6,86,243,0.6)] lg:pb-[58px] lg:pt-[68px]"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top-right ambient bloom matching Figma screenshot */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-[#1e60ff]/35 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-[#1e60ff]/55"
        aria-hidden="true"
      />

      <div className="relative z-10">
      <img
        src={image}
        alt={alt}
        className="mx-auto h-28 w-28 rounded-full object-cover shadow-[0_0_0_6px_rgba(48,118,255,0.14)] transition-shadow duration-500 group-hover:shadow-[0_0_0_8px_rgba(48,118,255,0.26)] lg:h-36 lg:w-36"
      />

      <h3 className="mt-8 font-display text-[18px] font-medium leading-[1.3] text-white lg:mt-[46px]">
        {name}
      </h3>

      <p className="mt-1 font-body text-[13px] text-accent-soft">{role}</p>

      <div className="mt-6 flex items-center justify-center gap-5 lg:mt-8">
        {SOCIALS.map(({ Icon, label, href, accent }) => (
          <a
            key={label}
            href={href}
            aria-label={`${name} on ${label}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`grid h-8 w-8 place-items-center rounded-full text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent ${
              accent ? "bg-accent shadow-[0_0_16px_rgba(48,118,255,0.6)]" : "bg-white/10"
            }`}
          >
            <Icon size={14} />
          </a>
        ))}
      </div>
      </div>
    </motion.article>
  );
}
