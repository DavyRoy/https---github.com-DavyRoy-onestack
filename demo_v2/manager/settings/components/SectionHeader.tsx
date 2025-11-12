"use client";

export default function SectionHeader({
  title,
  hint,
  cta,
}: {
  title: string;
  hint?: string;
  cta?: React.ReactNode;
}) {
  return (
    <header className="rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
          {hint && <p className="mt-1 text-sm text-white/70">{hint}</p>}
        </div>
        {cta && <div className="shrink-0">{cta}</div>}
      </div>
    </header>
  );
}