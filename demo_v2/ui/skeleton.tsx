// ui/skeleton.tsx
import clsx from "clsx";
export default function Skeleton({ className }:{className?:string}) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "animate-pulse rounded-xl bg-[hsl(var(--skeleton))]",
        "bg-gradient-to-r from-white/[0.04] via-white/[0.06] to-white/[0.04]",
        className
      )}
    />
  );
}