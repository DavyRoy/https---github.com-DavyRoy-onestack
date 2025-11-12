// src/app/demo/layout.tsx
"use client";

import type { ReactNode } from "react";
import DemoShell from "./ui/DemoShell";

export default function DemoLayout({ children }: { children: ReactNode }) {
  // DemoShell сам определяет роль по pathname и рендерит нужный shell
  return (
    <DemoShell>
      <div className="min-h-screen flex flex-col">{children}</div>
    </DemoShell>
  );
}