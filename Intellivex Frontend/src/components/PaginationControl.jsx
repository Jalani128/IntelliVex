import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControl({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  className = "",
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`mt-14 flex items-center justify-center gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous Page"
        className="flex h-10 w-10 items-center justify-center rounded-btn border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-2">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-10 min-w-10 items-center justify-center rounded-btn px-3 font-body text-[14px] font-medium transition-all duration-300 ${
                isActive
                  ? "border border-blue-500/60 bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                  : "border border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
        className="flex h-10 w-10 items-center justify-center rounded-btn border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
