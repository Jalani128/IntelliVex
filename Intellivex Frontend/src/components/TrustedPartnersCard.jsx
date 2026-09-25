import { motion } from "framer-motion";
import { Star } from "lucide-react";

/**
 * The 306 × 324 plate that sits beside the About copy in the Figma
 * "About Us" frame: two-tone title, blurb, five stars and a partner logo.
 */
export default function TrustedPartnersCard({
  title,
  highlight,
  description,
  rating = 5,
  logo,
}) {
  return (
    <motion.article
      className="surface-card group flex h-full flex-col p-8 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-[0_28px_60px_-24px_rgba(6,86,243,0.6)]"
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className="font-display text-[22px] font-medium leading-[1.2] text-white sm:text-[24px]">
        {title} <span className="text-gradient">{highlight}</span>
      </h3>

      <p className="mt-5 font-body text-[15px] leading-[1.55] text-white/75">{description}</p>

      <div className="mt-auto pt-7">
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <Star
                size={20}
                className={i < rating ? "fill-star text-star" : "fill-white/15 text-white/15"}
              />
            </motion.span>
          ))}
        </div>

        <img
          src={logo.src}
          alt={logo.alt}
          className="mt-6 h-6 w-auto opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
    </motion.article>
  );
}
