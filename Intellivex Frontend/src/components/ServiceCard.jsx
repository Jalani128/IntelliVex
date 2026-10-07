export default function ServiceCard({ icon, title, description, tags = [], href = "#" }) {
  return (
    <a
      href={href}
      className="surface-card bg-card-glow group flex h-full flex-col px-8 pb-14 pt-12 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-2 hover:border-accent/50 hover:shadow-[0_28px_60px_-24px_rgba(6,86,243,0.75)] lg:px-10 lg:pb-[68px] lg:pt-24"
    >
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="h-9 w-auto self-start object-contain transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:scale-110"
      />

      <h3 className="mt-12 font-display text-[24px] font-medium leading-tight text-white">
        {title}
      </h3>
      <p className="mt-3 font-body text-[14px] leading-[1.65] text-white/70">{description}</p>

      {/* Sub-services, in the same pills as the AI & Data Innovation card. */}
      {tags.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className="rounded-[4px] bg-accent-deep px-3 py-1.5 font-body text-[12px] leading-[1.3] text-white transition-colors duration-300 group-hover:bg-accent">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </a>
  );
}
