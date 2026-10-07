import { useState } from "react";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import RichContent from "./RichContent";

const HERO_SHAPES = [
  { className: "left-[2%] top-[10%]", size: 82, drift: 14, duration: 10, delay: 0.2 },
  { className: "right-[3%] top-[30%]", size: 82, drift: 12, duration: 11, delay: 0.6 },
];

function ClientLogoMark({ type = "geometric" }) {
  if (type === "wave") {
    return (
      <svg
        viewBox="0 0 120 40"
        className="h-14 w-auto text-[#2563EB] sm:h-16"
        fill="currentColor"
      >
        <path
          d="M10 20c0-5.5 4.5-10 10-10 4 0 7.5 2.4 9 5.8 2-3.4 5.7-5.8 10-5.8 6.3 0 11.5 5.2 11.5 11.5 0 2.8-1 5.3-2.7 7.3 3.5 1.5 6 5 6 9.2 0 5.5-4.5 10-10 10-4.3 0-8-2.7-9.5-6.5-1.5 2.5-4.2 4.2-7.3 4.2-4.8 0-8.8-3.9-8.8-8.7 0-1.6.4-3.1 1.2-4.4C14 26 10 23.4 10 20z"
          opacity="0.9"
        />
        <path
          d="M50 18c2-3 5.5-5 9.5-5 6.4 0 11.5 5.1 11.5 11.5S65.9 36 59.5 36c-4 0-7.5-2-9.5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M72 16c2-3 5-4.5 8.5-4.5 5.8 0 10.5 4.7 10.5 10.5S86.3 32.5 80.5 32.5c-3.5 0-6.5-1.5-8.5-4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="106" cy="14" r="3" />
      </svg>
    );
  }

  if (type === "lgpsm") {
    return (
      <div className="flex items-center gap-3">
        <div className="grid grid-cols-2 gap-1.5">
          <span className="h-3.5 w-3.5 rounded-[2px] bg-[#3B82F6]" />
          <span className="h-3.5 w-3.5 rounded-[2px] bg-[#10B981]" />
          <span className="h-3.5 w-3.5 rounded-[2px] bg-[#F59E0B]" />
          <span className="h-3.5 w-3.5 rounded-[2px] bg-[#EF4444]" />
        </div>
        <span className="font-display text-[26px] font-semibold tracking-wider text-white sm:text-[30px]">
          LGPSM<span className="text-white/60">I</span>
        </span>
      </div>
    );
  }

  /* Default / geometric orange symbol */
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-16 w-16 text-[#FF5722] sm:h-20 sm:w-20"
      fill="currentColor"
    >
      <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 6c7.73 0 14 6.27 14 14 0 3.32-1.16 6.37-3.1 8.8L15.2 13.1C17.63 11.16 20.68 10 24 10zm-14 14c0-3.32 1.16-6.37 3.1-8.8l19.7 19.7C30.37 36.84 27.32 38 24 38c-7.73 0-14-6.27-14-14z" />
    </svg>
  );
}

/** The client's uploaded logo; the placeholder mark when it's missing or fails to load. */
function ClientLogo({ src, name }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <ClientLogoMark />;
  return <img src={src} alt={`${name} logo`} onError={() => setFailed(true)} className="max-h-40 w-auto max-w-full object-contain" />;
}

/**
 * Intro of /client-portfolio/:slug — `data` from toClientDetail().hero
 * (services/testimonials.js): { eyebrow, lead, highlight, tail, html, name, logo, website }.
 */
export default function ClientPortfolioHero({ data }) {
  const card = (
    <div className="surface-card flex h-[280px] w-full max-w-[380px] items-center justify-center rounded-card p-10 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.4)] transition-all duration-500 hover:border-accent/40 hover:shadow-[0_28px_60px_-20px_rgba(6,86,243,0.45)] sm:h-[320px] lg:h-[350px]">
      <ClientLogo src={data.logo} name={data.name} />
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-navy pb-10 pt-6 sm:pb-14 sm:pt-8 lg:pb-16 lg:pt-10">
      <DecorSquares shapes={HERO_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal y={18}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.08} y={20}>
          <h2 className="mt-3.5 max-w-[940px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[40px] lg:text-[48px]">
            {data.lead} {data.lead && data.highlight && <br className="hidden sm:inline" />}
            <span className="text-gradient">{data.highlight}</span>
            {data.tail && ` ${data.tail}`}
          </h2>
        </Reveal>

        {/* 2-Column Layout: Left Narrative + Right Client Brand Card */}
        <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <Reveal delay={0.14} y={16}>
            <RichContent html={data.html} className="text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]" />
          </Reveal>

          {/* Right Column: Square Client Brand Card */}
          <Reveal delay={0.24} y={22} className="flex justify-center lg:justify-end">
            {/* The logo card links to the client's website when there is one. */}
            {data.website ? (
              <a href={data.website} target="_blank" rel="noopener noreferrer" aria-label={`${data.name} website`} className="flex w-full justify-center lg:justify-end">
                {card}
              </a>
            ) : (
              card
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
