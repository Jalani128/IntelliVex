import { useNavigate } from "react-router-dom";
import SiteLink from "./SiteLink";

/**
 * The AI & Data Innovation card that opens the Services grid. It shares the plate,
 * corner glow and hover behaviour with `ServiceCard`: icon, heading and description
 * at rest; hovering (or keyboard focus inside it) fades them out and the tag pills in.
 * The heading wraps on its own ("AI & Data" / "Innovation"), as it does in the frame.
 *
 * The swap is limited to `[@media(hover:hover)]` — touch screens can't hover, so
 * there the pills are simply listed under the content.
 * (Classes are written out in full: Tailwind only generates what it finds literally.)
 *
 * @param {string}   title      Plain leading words ("AI &").
 * @param {string}   highlight  Gradient remainder ("Data Innovation").
 * @param {string}   [icon]         Card icon, sized and animated like the other service cards'.
 * @param {string}   [description]  Same text style as the other service cards.
 * @param {Array<string|{label: string, href?: string}>} tags  Pills; a pill with `href` opens that service.
 * @param {string}   [href]     Service page — the heading links there when set (API data).
 */
export default function AIInnovationCard({ icon, title, highlight, description, tags = [], href }) {
  const heading = (
    <>
      {title} <span className="text-gradient">{highlight}</span>
    </>
  );
  const hasTags = tags.length > 0;
  const navigate = useNavigate();
  // The whole card opens the service page, like the other cards. Links inside it
  // (heading, tag pills) handle their own clicks; keyboard users have the heading link.
  const openService = (e) => {
    if (!href || e.target.closest("a")) return;
    navigate(href);
  };

  return (
    <article
      onClick={openService}
      className={`${href ? "cursor-pointer " : ""}surface-card bg-card-glow group relative flex h-full flex-col overflow-hidden px-8 pb-14 pt-12 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-2 hover:border-accent/50 hover:shadow-[0_28px_60px_-24px_rgba(6,86,243,0.75)] lg:px-10 lg:pb-[68px] lg:pt-24`}
    >
      {/* Card content — the resting state */}
      <div
        className={
          hasTags
            ? "flex flex-col transition-all duration-500 ease-[var(--ease-out-soft)] [@media(hover:hover)]:group-hover:-translate-y-3 [@media(hover:hover)]:group-hover:opacity-0 [@media(hover:hover)]:group-focus-within:opacity-0"
            : "flex flex-col"
        }
      >
        {icon && (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="h-9 w-auto self-start object-contain transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:scale-110"
          />
        )}

        {/* The frame breaks this after "Data". At 24px that first line measures
            103px and the whole string 221px, so capping the box between the two
            reproduces the break without hard-coding it into the copy. */}
        <h3 className={`${icon ? "mt-12 " : ""}max-w-[150px] font-display text-[24px] font-medium leading-tight text-white`}>
          {href ? (
            <SiteLink href={href} className="transition-colors duration-300 hover:text-accent-soft">
              {heading}
            </SiteLink>
          ) : (
            heading
          )}
        </h3>

        {description && <p className="mt-3 font-body text-[14px] leading-[1.65] text-white/70">{description}</p>}
      </div>

      {/* Tag pills — shown on hover / focus (and clickable then); listed under the content on touch screens */}
      {hasTags && (
        <div className="mt-6 flex flex-col transition-all duration-500 ease-[var(--ease-out-soft)] [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:absolute [@media(hover:hover)]:inset-0 [@media(hover:hover)]:mt-0 [@media(hover:hover)]:justify-center [@media(hover:hover)]:overflow-y-auto [@media(hover:hover)]:px-8 [@media(hover:hover)]:py-5 [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:pointer-events-auto [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:pointer-events-auto [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 lg:[@media(hover:hover)]:px-8 lg:[@media(hover:hover)]:py-10">
          {/* The heading stays as context on the hover face; touch screens already show it above. */}
          <p className="hidden max-w-[150px] font-display text-[22px] font-medium leading-[1.25] text-white [@media(hover:hover)]:block">
            {heading}
          </p>
          <ul className="flex flex-wrap gap-2.5 [@media(hover:hover)]:mt-5">
            {tags.map((tag) => {
              const { label, href: tagHref } = typeof tag === "string" ? { label: tag } : tag;
              const pill = "tag-glow block rounded-md px-3.5 py-1.5 font-body text-[13px] leading-[1.35] text-white transition-[filter] duration-300";
              return (
                <li key={label}>
                  {tagHref ? (
                    <SiteLink href={tagHref} className={`${pill} hover:brightness-125`}>
                      {label}
                    </SiteLink>
                  ) : (
                    <span className={pill}>{label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </article>
  );
}
