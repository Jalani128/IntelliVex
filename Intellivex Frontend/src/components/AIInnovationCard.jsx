/**
 * The AI & Data Innovation cell that opens the second row of the Services grid.
 * It shares the plate and corner glow with `ServiceCard` but carries no icon and
 * no description — just the heading over a run of tag pills. The heading wraps
 * on its own ("AI & Data" / "Innovation"), as it does in the frame.
 *
 * @param {string}   title      Plain leading words ("AI &").
 * @param {string}   highlight  Gradient remainder ("Data Innovation").
 * @param {string[]} tags
 */
export default function AIInnovationCard({ title, highlight, tags = [] }) {
  return (
    <article className="surface-card bg-card-glow group flex h-full flex-col px-8 pb-10 pt-12 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-2 hover:border-accent/50 hover:shadow-[0_28px_60px_-24px_rgba(6,86,243,0.75)] lg:px-10 lg:pb-12 lg:pt-14">
      {/* The frame breaks this after "Data". At 24px that first line measures
          103px and the whole string 221px, so capping the box between the two
          reproduces the break without hard-coding it into the copy. */}
      <h3 className="max-w-[150px] font-display text-[24px] font-medium leading-[1.25] text-white">
        {title} <span className="text-gradient">{highlight}</span>
      </h3>

      <ul className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 font-body text-[12px] leading-none text-white/85 transition-colors duration-300 group-hover:border-accent/60 group-hover:bg-accent/25"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
