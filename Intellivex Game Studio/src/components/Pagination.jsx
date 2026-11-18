function PageButton({ children, active, ...props }) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={`grid size-10 place-items-center rounded-full border font-lato text-[19.5px] transition-colors duration-300 disabled:opacity-40 ${
        active ? 'border-blue bg-blue text-white shadow-[0_0_20px_rgba(3,105,250,0.6)]' : 'border-[#647978] text-[#647978] hover:border-cyan hover:text-cyan'
      }`}
      {...props}
    >
      {children}
    </button>
  )
}

const Chevron = ({ flip }) => (
  <svg viewBox="0 0 16 16" aria-hidden className={`size-4 ${flip ? 'rotate-180' : ''}`}>
    <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** ‹ 1 2 › pager; renders nothing when everything fits on one page. */
export default function Pagination({ current, pages, onChange, className = '' }) {
  if (pages <= 1) return null
  return (
    <nav aria-label="Pages" className={`flex justify-center gap-4 ${className}`}>
      <PageButton aria-label="Previous page" disabled={current === 1} onClick={() => onChange(current - 1)}><Chevron flip /></PageButton>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <PageButton key={n} active={n === current} aria-label={`Page ${n}`} onClick={() => onChange(n)}>{n}</PageButton>
      ))}
      <PageButton aria-label="Next page" disabled={current === pages} onClick={() => onChange(current + 1)}><Chevron /></PageButton>
    </nav>
  )
}
