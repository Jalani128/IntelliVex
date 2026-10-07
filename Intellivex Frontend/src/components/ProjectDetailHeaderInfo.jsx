import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import SiteLink from "./SiteLink";
import RichContent from "./RichContent";
import Button from "./Button";

const SHAPES = [
  { className: "left-[2%] top-[10%]", size: 82, drift: 14, duration: 10, delay: 0.2 },
  { className: "right-[3%] top-[25%]", size: 82, drift: 12, duration: 11, delay: 0.6 },
];

/**
 * Intro of /portfolio/:slug and /products/:slug — `data` from toProjectDetail()
 * (services/portfolio.js) or toProductDetail() (services/products.js).
 */
export default function ProjectDetailHeaderInfo({ data }) {
  const clientClass =
    "rounded-btn bg-[#1877F2] px-4 py-1.5 font-body text-[13px] font-medium text-white shadow-[0_2px_12px_rgba(24,119,242,0.35)]";

  return (
    <section className="relative overflow-hidden bg-navy pb-8 pt-6 sm:pb-10 sm:pt-8 lg:pb-10 lg:pt-10">
      <DecorSquares shapes={SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal y={18}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.08} y={20}>
          <h2 className="mt-3.5 max-w-[940px] font-display text-[32px] font-medium leading-[1.18] text-white sm:text-[40px] lg:text-[48px]">
            {data.titleLine} <span className="text-gradient">{data.highlight}</span>
            {data.titleTail && ` ${data.titleTail}`}
          </h2>
        </Reveal>

        <Reveal delay={0.16} y={16}>
          <RichContent
            html={data.html}
            className="mt-4 max-w-[920px] text-[14px] leading-[1.7] text-white/75 sm:text-[15px] lg:text-[16px]"
          />
        </Reveal>

        {/* Client & Tags metadata row */}
        <Reveal delay={0.22} y={14}>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-transparent pb-2 sm:mt-8">
            {/* Left: Client / Industry */}
            <div className="flex items-center gap-3">
              <span className="font-body text-[13px] font-normal text-white/80 sm:text-[14px]">
                {data.clientLabel}
              </span>
              {data.clientHref ? (
                <SiteLink
                  href={data.clientHref}
                  className={`${clientClass} transition-colors hover:bg-[#1565D8]`}
                  {...(/^https?:/.test(data.clientHref) && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {data.clientValue}
                </SiteLink>
              ) : (
                <span className={clientClass}>{data.clientValue}</span>
              )}
            </div>

            {/* Right: Deliverables / Tag pills */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 font-body text-[12px] font-medium text-white/85 backdrop-blur-sm transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.1] sm:text-[13px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Optional call to action, e.g. a product's "View Demo" */}
        {data.action && (
          <Reveal delay={0.26} y={12}>
            <Button
              href={data.action.href}
              variant="primary"
              size="md"
              className="mt-6"
              {...(/^https?:/.test(data.action.href) && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {data.action.label}
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
