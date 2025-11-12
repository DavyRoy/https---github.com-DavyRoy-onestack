// ui/badge.tsx
import clsx from "clsx";

type Variant = "default" | "success" | "warning" | "danger" | "neutral" | "outline";
export default function Badge({ children, variant="default", className }:{children:React.ReactNode;variant?:Variant;className?:string}) {
  const styles: Record<Variant,string> = {
    default: "bg-[hsl(var(--brand))]/15 text-[hsl(var(--brand))] border-transparent",
    success: "bg-emerald-500/15 text-emerald-400 border-transparent",
    warning: "bg-amber-500/15 text-amber-400 border-transparent",
    danger: "bg-red-500/15 text-red-400 border-transparent",
    neutral: "bg-white/5 text-white/70 border-transparent",
    outline: "bg-transparent text-[hsl(var(--fg))] border-[hsl(var(--border))]",
  };
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium", styles[variant], className)}>
      {children}
    </span>
  );
}