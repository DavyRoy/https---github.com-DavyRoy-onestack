export default function DurationBadge({ base, extra }: { base: number; extra: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 px-3 py-1 text-xs font-semibold text-[hsl(var(--fg))]">
      {base + extra} мин
      {extra > 0 ? <span className="text-[hsl(var(--muted))]">(+{extra} мин)</span> : null}
    </span>
  );
}
