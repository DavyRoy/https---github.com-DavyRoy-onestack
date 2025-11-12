// ui/tooltip.tsx
import { HTMLAttributes, ReactNode, useId, useState } from "react";
import clsx from "clsx";

export default function Tooltip({
  children, content, side="top", className, ...props
}: { children: ReactNode; content: ReactNode; side?: "top"|"bottom"|"left"|"right"; } & HTMLAttributes<HTMLDivElement>) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={clsx("relative inline-block", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...props}
    >
      <span aria-describedby={id} className="inline-flex">{children}</span>
      {open && (
        <div
          id={id}
          role="tooltip"
          className={clsx(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-2.5 py-1.5 text-xs text-[hsl(var(--fg))] shadow-md",
            side === "top" && "left-1/2 -translate-x-1/2 -top-2 translate-y-[-100%]",
            side === "bottom" && "left-1/2 -translate-x-1/2 top-2 translate-y-[100%]",
            side === "left" && "top-1/2 -translate-y-1/2 -left-2 -translate-x-[100%]",
            side === "right" && "top-1/2 -translate-y-1/2 left-2 translate-x-[100%]"
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}