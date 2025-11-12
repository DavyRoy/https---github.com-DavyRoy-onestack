// ui/input.tsx
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Size = "sm" | "md" | "lg";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: Size;
  fullWidth?: boolean;
}

const sizeMap: Record<Size, { h: string; text: string; px: string; gap: string }> = {
  sm: { h: "h-9",  text: "text-sm", px: "pl-8 pr-3", gap: "gap-1.5" },
  md: { h: "h-11", text: "text-sm", px: "pl-9 pr-3.5", gap: "gap-2" },
  lg: { h: "h-12", text: "text-base", px: "pl-11 pr-4", gap: "gap-2" },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, size="md", fullWidth, id, ...props }, ref) => {
    const s = sizeMap[size];
    const inputId = id ?? props.name ?? `in_${Math.random().toString(36).slice(2)}`;
    const describedBy = error ? `${inputId}-err` : helperText ? `${inputId}-help` : undefined;

    return (
      <div className={clsx("flex flex-col", fullWidth && "w-full")}>
        {label && (
          <label htmlFor={inputId} className="mb-1 text-sm text-[hsl(var(--muted))]">
            {label}
          </label>
        )}

        <div
          className={clsx(
            "group relative flex items-center",
            s.h, s.text, s.gap,
            "rounded-xl border bg-[hsl(var(--control-bg))] text-[hsl(var(--fg))]",
            "border-[hsl(var(--border))] hover:border-[hsl(var(--border-strong))]",
            "focus-within:ring-2 focus-within:ring-[hsl(var(--brand))]",
            error && "border-red-500/70 focus-within:ring-red-500/60",
            fullWidth && "w-full"
          )}
        >
          {leftIcon && <span className="pointer-events-none absolute left-3 opacity-70">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={clsx(
              "peer w-full bg-transparent outline-none placeholder:text-[hsl(var(--muted))] disabled:opacity-60",
              s.px
            )}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 opacity-80">{rightIcon}</span>}
        </div>

        {error ? (
          <p id={`${inputId}-err`} className="mt-1 text-xs text-red-400">{error}</p>
        ) : helperText ? (
          <p id={`${inputId}-help`} className="mt-1 text-xs text-[hsl(var(--muted))]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;