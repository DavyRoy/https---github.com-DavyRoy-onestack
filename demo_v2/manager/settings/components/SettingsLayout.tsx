"use client";

import SettingsNav from "./SettingsNav";

const T = {
  grid: "grid gap-4 md:grid-cols-[260px_1fr]",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={T.grid}>
      <SettingsNav />
      <div className="grid gap-4">{children}</div>
    </div>
  );
}