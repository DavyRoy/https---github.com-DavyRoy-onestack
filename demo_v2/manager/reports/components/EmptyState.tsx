"use client";

export default function EmptyState({ text }: { text: string }) {
  return (
    <div
      className="rounded-xl border border-white/15 bg-white/[0.04] p-6 text-center text-sm text-white/70"
      role="status"
      aria-live="polite"
    >
      {text}
    </div>
  );
}