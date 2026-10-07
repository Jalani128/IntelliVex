import { useState } from "react";
import Reveal from "./Reveal";

/** A client logo; the client's name when the logo is missing or fails to load. */
function LogoMark({ logo }) {
  const [failed, setFailed] = useState(false);
  if (!logo.src || failed) {
    return <span className="font-display text-[18px] font-semibold text-white/80">{logo.name}</span>;
  }
  return (
    <img
      src={logo.src}
      alt={logo.alt}
      onError={() => setFailed(true)}
      className="h-7 w-auto object-contain transition-transform duration-300 hover:scale-105 sm:h-8 lg:h-9"
    />
  );
}

/**
 * Client logo row. `logos`: [{ id, src, alt, name, href }] — `href` (the client's
 * website) makes a logo a link. Left out when there are no logos.
 */
export default function TestimonialsLogoBar({ logos = [] }) {
  if (logos.length === 0) return null;

  return (
    <div className="relative bg-navy pb-10 pt-4 sm:pb-12 sm:pt-6 lg:pb-14">
      <div className="container-narrow flex flex-wrap items-center justify-center gap-10 opacity-80 transition-opacity duration-300 hover:opacity-100 sm:justify-between sm:gap-12">
        {logos.map((logo, i) => (
          <Reveal key={logo.id ?? i} delay={0.06 * i} y={10} className="flex justify-center">
            {logo.href ? (
              <a href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.name}>
                <LogoMark logo={logo} />
              </a>
            ) : (
              <LogoMark logo={logo} />
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
