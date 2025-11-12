"use client";

export function SegmentEditor() {
  return (
    <section className="rounded-2xl border border-white/15 p-4 bg-white/[0.03] grid gap-3">
      <div className="text-sm text-white/70">Конструктор условий (демо)</div>
      <div className="grid gap-2 md:grid-cols-3">
        <select className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm">
          <option>lastActivity &gt; 90d</option>
          <option>tag = vip</option>
          <option>ltv &gt; 100k</option>
        </select>
        <select className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm">
          <option>AND</option>
          <option>OR</option>
        </select>
        <select className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm">
          <option>orders &gt;= 3</option>
          <option>country = RU</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button className="rounded border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-2 text-sm">
          Применить
        </button>
        <button className="rounded border border-white/20 hover:bg-white/10 px-3 py-2 text-sm">
          Сбросить
        </button>
      </div>
    </section>
  );
}

export function SegmentPreview() {
  return (
    <section className="rounded-2xl border border-white/15 p-4 bg-white/[0.03]">
      <div className="text-sm text-white/70 mb-2">Предпросмотр совпадений (демо)</div>
      <div className="grid gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded border border-white/10 px-3 py-2 text-sm">
            Клиент {i + 1}
          </div>
        ))}
      </div>
    </section>
  );
}