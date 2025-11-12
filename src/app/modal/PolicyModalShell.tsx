// src/app/modal/PolicyModalShell.tsx
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function PolicyModalShell({
  children,
  title,
  closeHref = "/",
}: {
  children: React.ReactNode;
  title: string;
  closeHref?: string;
}) {
  // Закрывать по Esc + блокировать scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.history.back();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl border border-white/10 bg-black p-6">
        <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Link
            aria-label="Закрыть"
            href={closeHref}
            className="rounded-full p-2 border border-white/15 bg-white/[0.06] hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
        <div className="prose prose-invert max-w-none mt-4">{children}</div>
      </div>
    </div>
  );
}