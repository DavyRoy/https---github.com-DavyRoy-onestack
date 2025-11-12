"use client";

export default function Skeletons() {
  return (
    <div
      className="
        grid gap-2 sm:gap-3 w-full max-w-full min-w-0
        animate-pulse
      "
      aria-hidden="true"
    >
      <div className="h-8 rounded-lg bg-white/[0.08] backdrop-blur-sm" />
      <div className="h-6 rounded-lg bg-white/[0.06] backdrop-blur-sm" />
      <div className="h-6 rounded-lg bg-white/[0.06] backdrop-blur-sm" />
    </div>
  );
}