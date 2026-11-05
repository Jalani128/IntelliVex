import SiteLink from "./SiteLink";

/**
 * Service card (opens the service's detail page): icon, title and description. Hovering (or keyboard focus) fades the
 * content out and the sub-services in, as the same tag pills the AI card uses.
 *
 * The swap is limited to `[@media(hover:hover)]` — touch screens can't hover, so
 * there the sub-services are simply listed under the content.
 * (Classes are written out in full: Tailwind only generates what it finds literally.)
 *
 * @param {string[]} [tags]  Sub-services.
 */
export default function ServiceCard({ icon, title, description, tags = [], href = "#" }) {
  const hasTags = tags.length > 0;

  return (
    <SiteLink
      href={href}
      className="surface-card bg-card-glow group relative flex h-full flex-col overflow-hidden px-8 pb-14 pt-12 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-2 hover:border-accent/50 hover:shadow-[0_28px_60px_-24px_rgba(6,86,243,0.75)] lg:px-10 lg:pb-[68px] lg:pt-24"
    >
      {/* Service content — the resting state */}
      <div
        className={
          hasTags
            ? "flex flex-col transition-all duration-500 ease-[var(--ease-out-soft)] [@media(hover:hover)]:group-hover:-translate-y-3 [@media(hover:hover)]:group-hover:opacity-0 [@media(hover:hover)]:group-focus-visible:opacity-0"
            : "flex flex-col"
        }
      >
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className="h-9 w-auto self-start object-contain transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:scale-110"
        />

        <h3 className="mt-12 font-display text-[24px] font-medium leading-tight text-white">{title}</h3>
        <p className="mt-3 font-body text-[14px] leading-[1.65] text-white/70">{description}</p>
      </div>

      {/* Sub-services — shown on hover / focus; listed under the content on touch screens */}
      {hasTags && (
        <div className="mt-6 flex flex-col transition-all duration-500 ease-[var(--ease-out-soft)] [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:absolute [@media(hover:hover)]:inset-0 [@media(hover:hover)]:mt-0 [@media(hover:hover)]:justify-center [@media(hover:hover)]:overflow-y-auto [@media(hover:hover)]:[scrollbar-width:none] [@media(hover:hover)]:[&::-webkit-scrollbar]:hidden [@media(hover:hover)]:px-8 [@media(hover:hover)]:py-6 [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100 lg:[@media(hover:hover)]:px-8 lg:[@media(hover:hover)]:py-10">
          {/* The title stays as context on the hover face; touch screens already show it above. */}
          <p className="hidden text-center font-display text-[22px] font-medium leading-tight text-white [@media(hover:hover)]:block">{title}</p>
          {/* Equal-width, centred pills. */}
          <ul className="flex flex-col gap-2.5 [@media(hover:hover)]:mt-5">
            {tags.map((tag) => (
              <li key={tag} className="tag-glow rounded-full px-4 py-2 text-center font-body text-[13px] leading-[1.35] text-white">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </SiteLink>
  );
}
