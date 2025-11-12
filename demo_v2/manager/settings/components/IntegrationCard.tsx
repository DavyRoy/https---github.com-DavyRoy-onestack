"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function IntegrationCard({
  title,
  connected,
  onToggle,
  children,
}: {
  title: string;
  connected: boolean;
  onToggle: (next: boolean) => void;
  children?: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);
  const toggle = async () => {
    setBusy(true);
    setTimeout(() => {
      onToggle(!connected);
      toast(connected ? "Отключено (демо)" : "Подключено (демо)");
      setBusy(false);
    }, 500);
  };
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.05] p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{title}</div>
        <button
          disabled={busy}
          onClick={toggle}
          className={
            "rounded-lg px-3 py-1.5 text-sm " +
            (connected ? "bg-white text-black hover:bg-white/90" : "border border-white/15 bg-white/10 hover:bg-white/15")
          }
        >
          {connected ? "Отключить" : "Подключить"}
        </button>
      </div>
      {children && <div className="mt-2 text-sm text-white/80">{children}</div>}
      <div className="mt-2 text-xs opacity-70">Статус: {connected ? "подключено" : "не подключено"}</div>
    </div>
  );
}