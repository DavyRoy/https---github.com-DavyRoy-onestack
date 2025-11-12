export default function SDPDetails({
  description,
  highlights,
  contraindications,
}: {
  description: string;
  highlights: string[];
  contraindications: string[];
}) {
  return (
    <section className="space-y-6 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[hsl(var(--fg))]">Описание</h2>
        <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted))]">{description}</p>
      </div>

      {highlights.length ? (
        <div>
          <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Что входит</h3>
          <ul className="mt-2 space-y-1 text-sm text-[hsl(var(--muted))]">
            {highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand))]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {contraindications.length ? (
        <div>
          <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Противопоказания</h3>
          <ul className="mt-2 space-y-1 text-sm text-[hsl(var(--muted))]">
            {contraindications.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-rose-400" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
