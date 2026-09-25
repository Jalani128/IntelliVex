/**
 * Hero stat plate. The design clips the top-right corner, so the outline is
 * drawn as an SVG polygon sized 1:1 with the box (no stroke distortion).
 */
export default function ExperienceBadge({ value, label }) {
  return (
    <div className="relative flex h-[88px] w-[232px] items-center gap-4 px-6">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 232 88"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon
          points="0.5,0.5 207.5,0.5 231.5,24.5 231.5,87.5 0.5,87.5"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span className="relative font-display text-[40px] font-semibold leading-none text-white">
        {value}
      </span>
      <span className="relative max-w-[80px] text-left font-body text-[14px] leading-[1.3] text-white/85">
        {label}
      </span>
    </div>
  );
}
