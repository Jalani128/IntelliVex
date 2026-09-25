import { Fragment } from "react";
import Reveal from "./Reveal";
import SiteLink from "./SiteLink";
import DecorSquares from "./DecorSquares";

/* Two tile clusters frame the band in the Figma frame: one high on the left,
   one lower on the right, level with the breadcrumb. */
const HEADER_SHAPES = [
  { className: "left-[5.5%] top-[132px]", size: 82, drift: 13, duration: 10 },
  { className: "right-[4%] top-[228px]", size: 82, drift: 15, duration: 12, delay: 0.8 },
];

/**
 * The banner every inner page opens with: a centred title over a breadcrumb,
 * sitting on the blue bloom that spills down from behind the navbar.
 *
 * @param {string} title
 * @param {Array<{label: string, to?: string}>} breadcrumbs  Last item is the
 *        current page and is rendered as plain text.
 * @param {boolean} gradient  Service Details runs the accent gradient across
 *        the whole title instead of setting it in white.
 */
export default function PageHeader({ title, breadcrumbs = [], gradient = false }) {
  return (
    <section className="bg-page-glow relative overflow-hidden bg-navy pb-12 pt-[136px] sm:pb-14 sm:pt-[160px] lg:pb-[56px] lg:pt-[162px]">
      <DecorSquares shapes={HEADER_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative text-center">
        <Reveal y={22}>
          <h1
            className={`font-display text-[34px] font-medium leading-[1.2] sm:text-[42px] lg:text-[52px] ${
              gradient ? "text-gradient" : "text-white"
            }`}
          >
            {title}
          </h1>
        </Reveal>

        <Reveal delay={0.12} y={16}>
          <nav
            aria-label="Breadcrumb"
            className="mt-4 flex items-center justify-center gap-2 font-body text-[14px]"
          >
            {breadcrumbs.map((crumb, i) => (
              <Fragment key={crumb.label}>
                {i > 0 && <span className="text-white/40">/</span>}

                {crumb.to ? (
                  <SiteLink
                    href={crumb.to}
                    className="text-white/75 transition-colors duration-300 hover:text-accent-soft"
                  >
                    {crumb.label}
                  </SiteLink>
                ) : (
                  <span aria-current="page" className="text-white">
                    {crumb.label}
                  </span>
                )}
              </Fragment>
            ))}
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
