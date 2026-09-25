import { ArrowRight } from "lucide-react";
import SiteLink from "./SiteLink";

const VARIANTS = {
  /* White pill — "GET STARTED", "CONTACT", "CONTACT US" */
  light: "bg-white text-navy hover:bg-accent hover:text-white",
  /* Solid brand blue — "EXPLORE MORE" */
  primary: "bg-accent text-white hover:bg-white hover:text-navy",
  /* Hairline outline on dark — "VIEW ALL" */
  outline: "border border-white/25 text-white hover:border-white hover:bg-white hover:text-navy",
  /* Bare text + arrow — "VIEW DETAILS" */
  ghost: "text-white hover:text-accent-soft",
};

const SIZES = {
  sm: "px-4 py-2 text-[11px] gap-2",
  md: "px-5 py-2.5 text-[12px] gap-2.5",
  none: "gap-2 text-[12px]",
};

/**
 * The single button used across the site. Every call site picks a
 * variant + size instead of re-declaring padding/colour utilities.
 */
export default function Button({
  as: Tag = SiteLink,
  variant = "light",
  size = "md",
  withArrow = true,
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={`group/btn inline-flex items-center justify-center whitespace-nowrap rounded-btn font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 ease-[var(--ease-out-soft)] ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
      {withArrow && (
        <ArrowRight
          size={size === "md" ? 16 : 13}
          strokeWidth={2.5}
          className="transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-1"
        />
      )}
    </Tag>
  );
}
