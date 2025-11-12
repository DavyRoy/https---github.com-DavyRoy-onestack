import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, children }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center px-2 py-0.5 text-xs rounded-lg border border-base", className)}>{children}</span>;
}