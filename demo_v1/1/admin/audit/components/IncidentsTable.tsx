"use client";

type Row = {
  id: string;
  name: string;
  url: string;
  count24h?: number;      // сделал опц., чтобы не падать на странных данных
  failPct: string;        // например "1.4%"
  retryPct: string;       // например "0.6%"
  latencyMed: number;
};

export default function WebhooksDeliveryStats({ rows }: { rows: Row[] }) {
  const badge = (label: string, tone: "ok" | "warn" | "bad") => {
    const map = {
      ok: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
      warn: "bg-amber-500/20 text-amber-200 border-amber-400/30",
      bad: "bg-rose-500/20 text-rose-200 border-rose-400/30",
    } as const;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] ${map[tone]}`}
      >
        {label}
      </span>
    );
  };

  const toneForPct = (pctStr: string): "ok" | "warn" | "bad" => {
    const v = Number(String(pctStr).replace("%", "").trim());
    if (Number.isNaN(v)) return "ok";
    if (v >= 2) return "bad";
    if (v >= 0.5) return "warn";
    return "ok";
  };

  const fmtNum = (n: unknown) =>
    typeof n === "number" ? n.toLocaleString("ru-RU") : "—";

  const colWidths = ["w-[220px]", "w-[340px]", "w-[110px]", "w-[90px]", "w-[90px]", "w-[120px]"];

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
      <div className="text-sm font-medium mb-2">Вебхуки — доставки</div>

      {/* Мобильные карточки */}
      <div className="grid gap-3 md:hidden">
        {rows.length === 0 && (
          <div className="rounded-xl border border-white/10 p-3 text-center text-white/70">
            Нет данных
          </div>
        )}
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl border border-white/10 p-3 bg-white/[0.02]">
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-sm">{r.name}</div>
              <div className="text-xs text-white/60">{r.latencyMed} ms</div>
            </div>
            <div className="mt-1 text-xs text-white/60 break-all">{r.url}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/70">24ч:</span>
              <span className="text-sm">{fmtNum(r.count24h)}</span>
              {badge(`Fail ${r.failPct}`, toneForPct(r.failPct))}
              {badge(`Retry ${r.retryPct}`, toneForPct(r.retryPct))}
            </div>
          </div>
        ))}
      </div>

      {/* Десктопная таблица */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[820px] w-full text-sm table-fixed">
          {/* ВАЖНО: генерируем <col> без «сырых» пробелов, чтобы не было hydration-ошибок */}
          <colgroup>
            {colWidths.map((w, i) => (
              <col key={i} className={w} />
            ))}
          </colgroup>
          <thead className="bg-white/[0.04] text-white/80">
            <tr>
              <th className="p-2 text-left">Эндпоинт</th>
              <th className="p-2 text-left">URL</th>
              <th className="p-2 text-right">24ч</th>
              <th className="p-2 text-left">Fail %</th>
              <th className="p-2 text-left">Retry %</th>
              <th className="p-2 text-left">Median (ms)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                <td className="p-2">{r.name}</td>
                <td className="p-2">
                  <div className="truncate max-w-[320px]">{r.url}</div>
                </td>
                <td className="p-2 text-right">{fmtNum(r.count24h)}</td>
                <td className="p-2">{badge(r.failPct, toneForPct(r.failPct))}</td>
                <td className="p-2">{badge(r.retryPct, toneForPct(r.retryPct))}</td>
                <td className="p-2">{r.latencyMed}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-white/70">
                  Нет данных
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}