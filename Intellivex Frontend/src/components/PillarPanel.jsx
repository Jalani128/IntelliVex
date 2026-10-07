import { motion } from "framer-motion";
import asterisk from "../assets/icon.png";

/**
 * Full-width "Our Vision" / "Our Mission" plate: oversized two-tone heading
 * on the left, a 460px copy column on the right and a blue bloom bleeding in
 * from the right edge — the pair that closes the Figma About section.
 */
export default function PillarPanel({ title, highlight, tail, description, delay = 0 }) {
  return (
    <motion.article
      className="surface-card bg-panel-glow group relative overflow-hidden border-t-white/20 px-6 py-10 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-accent/40 hover:shadow-[0_28px_70px_-30px_rgba(6,86,243,0.65)] sm:px-10 lg:min-h-[210px] lg:px-14 lg:py-12 xl:px-20"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex h-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <h3 className="flex items-center gap-3 font-display text-[28px] font-medium leading-[1.1] text-white sm:text-[40px] lg:text-[54px]">
          <img
            src={asterisk}
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-90 sm:h-5 sm:w-5"
          />
          {title} <span className="text-gradient">{highlight}</span>
          {tail && ` ${tail}`}
        </h3>

        <p className="font-body text-[15px] leading-[1.55] text-white/75 lg:w-[460px]">
          {description}
        </p>
      </div>
    </motion.article>
  );
}
