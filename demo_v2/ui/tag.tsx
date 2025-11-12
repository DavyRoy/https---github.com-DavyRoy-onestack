// ui/tag.tsx
import clsx from "clsx";

export default function Tag({
  children, onClose, className,
}: { children: React.ReactNode; onClose?: () => void; className?: string }) {
  return (
    <span className={clsx(
      "inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--control-bg))]",
      "px-3 py-1.5 text-xs text-[hsl(var(--fg))]"
      , className
    )}>
      {children}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-1 rounded-full p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))]"
          aria-label="Удалить тег"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" className="opacity-80">
            <path fill="currentColor" d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  );
}