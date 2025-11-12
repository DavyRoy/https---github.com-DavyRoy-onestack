// src/app/demo/user/layoutClient.tsx
"use client";

import type { ReactNode } from "react";
import DemoShell from "../ui/DemoShell";

export default function DemoUserLayoutClient({ children }: { children: ReactNode }) {
  return (
    <DemoShell mode="user">
      <div className="flex-1 min-h-screen bg-[#0b0d0e]">
        {children}
      </div>
    </DemoShell>
  );
}