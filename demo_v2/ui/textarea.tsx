// ui/textarea.tsx
import { forwardRef, TextareaHTMLAttributes } from "react";
import clsx from "clsx";

type Size = "sm" | "md" | "lg";
const pad: Record<Size, string> = { sm: "p-2.5 text-sm", md: "p-3 text-sm", lg: "p-4 text-base" };

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; helperText?: string; error?: string; size?: Size; fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, helperText, error, size="md", fullWidth, id, ...props }, ref) => {
    const taId = id ?? props.name ?? `ta_${Math.random().toString(36).slice(2)}`;
    const described = error ? `${taId}-err` : helperText ? `${taId}-help` : undefined;

    return (
      <div className={clsx("flex flex-col", fullWidth && "w-full")}>
        {label && <label htmlFor={taId} className="mb-1 text-sm text-[hsl(var(--muted))]">{label}</label>}
        <textarea
          ref={ref}
          id={taId}
          aria-invalid={!!error}
          aria-describedby={described}
          className={clsx(
            "rounded-xl border bg-[hsl(var(--control-bg))] text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))]",
            "border-[hsl(var(--border))] hover:border-[hsl(var(--border-strong))]",
            "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))] disabled:opacity-60",
            error && "border-red-500/70 focus:ring-red-500/60",
            pad[size],
            fullWidth && "w-full",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={`${taId}-err`} className="mt-1 text-xs text-red-400">{error}</p>
        ) : helperText ? (
          <p id={`${taId}-help`} className="mt-1 text-xs text-[hsl(var(--muted))]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
export default TextArea;