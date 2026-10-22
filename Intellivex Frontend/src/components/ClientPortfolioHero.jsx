import { useState } from "react";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import RichContent from "./RichContent";

const HERO_SHAPES = [
  { className: "left-[2%] top-[10%]", size: 82, drift: 14, duration: 10, delay: 0.2 },
  { className: "right-[3%] top-[30%]", size: 82, drift: 12, duration: 11, delay: 0.6 },
];

/** The client's uploaded logo; the client's name when it's missing or fails to load. */
function ClientLogo({ src, name }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <span className="text-center font-display text-[26px] font-semibold text-white sm:text-[30px]">{name}</span>;
  }
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
