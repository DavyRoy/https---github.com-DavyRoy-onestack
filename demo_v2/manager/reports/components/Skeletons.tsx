"use client";

export default function Skeletons({
  kind,
}: {
  kind: "kpi" | "charts" | "heat";
}) {
  if (kind === "kpi") {
    return (
      <div className="grid gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (kind === "heat") {
    return (
      <div className="h-56 rounded-xl bg-white/10 animate-pulse" />
    );
  }

  // charts
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="h-56 rounded-xl bg-white/10 animate-pulse" />
      <div className="h-56 rounded-xl bg-white/10 animate-pulse" />
    </div>
  );
}