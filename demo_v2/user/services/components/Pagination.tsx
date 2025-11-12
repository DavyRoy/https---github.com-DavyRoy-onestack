"use client";

import clsx from "clsx";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav className="flex flex-col items-center gap-3" aria-label="Навигация по страницам">
      <div className="hidden gap-2 sm:flex">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={clsx(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition",
              page === currentPage
                ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))] text-white"
                : "border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-full rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80 disabled:cursor-not-allowed disabled:opacity-60 sm:hidden"
      >
        Показать ещё
      </button>
    </nav>
  );
}
