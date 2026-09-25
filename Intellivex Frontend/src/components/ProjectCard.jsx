import Button from "./Button";

export default function ProjectCard({ badge, title, description, tags = [], image, href = "#" }) {
  return (
    <article className="surface-card group grid gap-6 p-6 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-accent/50 hover:shadow-[0_28px_60px_-24px_rgba(6,86,243,0.6)] lg:grid-cols-[1fr_minmax(0,522px)] lg:items-stretch">
      {/* Copy */}
      <div className="flex flex-col lg:py-4 lg:pl-4">
        <span className="w-fit rounded-btn bg-accent px-3 py-1.5 font-body text-[12px] font-medium text-white">
          {badge}
        </span>

        <h3 className="mt-5 font-display text-[24px] font-medium leading-tight text-white">
          {title}
        </h3>
        <p className="mt-3 max-w-[400px] font-body text-[14px] leading-[1.65] text-white/70">
          {description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1.5 font-body text-[11px] text-white/80"
            >
              {tag}
            </li>
          ))}
        </ul>

        <Button href={href} variant="ghost" size="none" className="mt-8 self-start lg:mt-auto">
          View Details
        </Button>
      </div>

      {/* Artwork */}
      <div className="overflow-hidden rounded-lg">
        <img
          src={image}
          alt={title}
          className="h-full min-h-[200px] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
      </div>
    </article>
  );
}
