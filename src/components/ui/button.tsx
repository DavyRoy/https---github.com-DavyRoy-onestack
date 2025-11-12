import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant="default", size="md", ...props }, ref) => {
    const v = {
      default: "bg-primary text-primary-foreground border border-transparent hover:opacity-90",
      outline: "bg-transparent border border-base hover:bg-muted",
      ghost: "bg-transparent border border-transparent hover:bg-muted",
    }[variant];

    const s = {
      sm: "px-2.5 py-1.5 text-xs rounded-xl",
      md: "px-3.5 py-2 text-sm rounded-xl",
      lg: "px-4.5 py-2.5 text-base rounded-2xl",
    }[size];

    return (
      <button ref={ref} className={cn("inline-flex items-center justify-center transition shadow-sm", v, s, className)} {...props} />
    );
  }
);
Button.displayName = "Button";