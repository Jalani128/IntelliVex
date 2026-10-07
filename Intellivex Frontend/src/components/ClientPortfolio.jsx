import { useState } from "react";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import SiteLink from "./SiteLink";
import DecorSquares from "./DecorSquares";

const SHAPES = [
  { className: "left-[2%] top-[10%]", size: 82, drift: 14, duration: 10, delay: 0.2 },
  { className: "right-[3%] top-[30%]", size: 82, drift: 12, duration: 11, delay: 0.6 },
];

function ClientLogoMark({ type }) {
  if (type === "wave") {
    return (
      <svg
        viewBox="0 0 120 40"
        className="h-9 w-auto text-[#2563EB] transition-transform duration-500 group-hover:scale-110 sm:h-10"
        fill="currentColor"
      >
        <path d="M10 20c0-5.5 4.5-10 10-10 4 0 7.5 2.4 9 5.8 2-3.4 5.7-5.8 10-5.8 6.3 0 11.5 5.2 11.5 11.5 0 2.8-1 5.3-2.7 7.3 3.5 1.5 6 5 6 9.2 0 5.5-4.5 10-10 10-4.3 0-8-2.7-9.5-6.5-1.5 2.5-4.2 4.2-7.3 4.2-4.8 0-8.8-3.9-8.8-8.7 0-1.6.4-3.1 1.2-4.4C14 26 10 23.4 10 20z" opacity="0.9" />
        <path d="M50 18c2-3 5.5-5 9.5-5 6.4 0 11.5 5.1 11.5 11.5S65.9 36 59.5 36c-4 0-7.5-2-9.5-5" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d="M72 16c2-3 5-4.5 8.5-4.5 5.8 0 10.5 4.7 10.5 10.5S86.3 32.5 80.5 32.5c-3.5 0-6.5-1.5-8.5-4.5" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <circle cx="106" cy="14" r="3" />
      </svg>
    );
  }

  if (type === "lgpsm") {
    return (
      <div className="flex items-center gap-3 transition-transform duration-500 group-hover:scale-105">
        <div className="grid grid-cols-2 gap-1">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#3B82F6]" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#10B981]" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#F59E0B]" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#EF4444]" />
        </div>
        <span className="font-display text-[20px] font-semibold tracking-wider text-white sm:text-[22px]">
          LGPSM<span className="text-white/60">I</span>
        </span>
      </div>
    );
  }

  /* type: geometric (orange) */
  return (
    <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10 text-[#FF5722] sm:h-11 sm:w-11"
        fill="currentColor"
      >
        <path
          d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 6c7.73 0 14 6.27 14 14 0 3.32-1.16 6.37-3.1 8.8L15.2 13.1C17.63 11.16 20.68 10 24 10zm-14 14c0-3.32 1.16-6.37 3.1-8.8l19.7 19.7C30.37 36.84 27.32 38 24 38c-7.73 0-14-6.27-14-14z"
        />
      </svg>
    </div>
  );
}

/* Placeholder marks for clients without a logo, so the grid keeps its look. */
const FALLBACK_MARKS = ["wave", "lgpsm", "geometric"];

/** The uploaded logo; a placeholder mark when it's missing or fails to load. */
function ClientLogo({ client, index }) {
  const [failed, setFailed] = useState(false);
  if (!client.logo || failed) return <ClientLogoMark type={FALLBACK_MARKS[index % FALLBACK_MARKS.length]} />;
  return (
    <img
      src={client.logo}
      alt={`${client.name} logo`}
      onError={() => setFailed(true)}
      className="max-h-16 w-auto max-w-[70%] object-contain transition-transform duration-500 group-hover:scale-110 sm:max-h-20"
    />
  );
}

/**
 * Client Portfolio grid — `data`: { eyebrow, lead, highlight, tail, paragraphs, clients }.
 * Each card links to /client-portfolio/{slug}. Left out when there are no clients.
 */
export default function ClientPortfolio({ data }) {
  if (data.clients.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-navy pb-14 pt-4 sm:pb-18 sm:pt-6 lg:pb-24 lg:pt-8">
      <DecorSquares shapes={SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal y={18}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.08} y={20}>
          <h2 className="mt-3.5 max-w-[940px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[40px] lg:text-[48px]">
            {data.lead} <span className="text-gradient">{data.highlight}</span>
            {data.tail && ` ${data.tail}`}
          </h2>
        </Reveal>

        <div className="mt-5 space-y-3">
          {data.paragraphs.map((text, i) => (
            <Reveal key={i} delay={0.14 + i * 0.06} y={16}>
              <p className="max-w-[1060px] font-body text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]">
                {text}
              </p>
            </Reveal>
          ))}
        </div>

        {/* 3x2 Grid of 6 Client Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          {data.clients.map((client, i) => (
            <Reveal key={client.id || i} delay={0.08 * (i + 1)} y={20}>
              <SiteLink
                href={client.href}
                className="group flex flex-col cursor-pointer"
              >
                <div className="surface-card flex h-[150px] items-center justify-center rounded-card p-6 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-accent/50 hover:shadow-[0_20px_50px_-20px_rgba(6,86,243,0.5)] sm:h-[170px] lg:h-[190px]">
                  <ClientLogo client={client} index={i} />
                </div>
                <p className="mt-3 text-center font-body text-[13px] font-normal text-white/70 transition-colors duration-300 group-hover:text-white sm:text-[14px]">
                  {client.name}
                </p>
              </SiteLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
