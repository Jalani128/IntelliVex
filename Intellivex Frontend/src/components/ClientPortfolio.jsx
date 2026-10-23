import { useState } from "react";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import SiteLink from "./SiteLink";
import DecorSquares from "./DecorSquares";

const SHAPES = [
  { className: "left-[2%] top-[10%]", size: 82, drift: 14, duration: 10, delay: 0.2 },
  { className: "right-[3%] top-[30%]", size: 82, drift: 12, duration: 11, delay: 0.6 },
];

/** The uploaded logo; the client's name when it's missing or fails to load. */
function ClientLogo({ client }) {
  const [failed, setFailed] = useState(false);
  if (!client.logo || failed) {
    return (
      <span className="text-center font-display text-[20px] font-semibold text-white transition-transform duration-500 group-hover:scale-105 sm:text-[22px]">
        {client.name}
      </span>
    );
  }
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
                  <ClientLogo client={client} />
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
