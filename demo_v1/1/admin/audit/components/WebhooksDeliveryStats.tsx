"use client";

export default function WebhooksDeliveryStats({ rows }: { rows: any[] }) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3">
      <div className="text-sm font-medium mb-2">Вебхуки — доставки</div>

      {/* 📱 Мобильный вид */}
      <div className="grid gap-3 md:hidden">
        {rows.length === 0 && (
          <div className="rounded-xl border border-white/10 p-4 text-center text-white/70">
            Нет данных
          </div>
        )}
        {rows.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-white/15 bg-white/[0.04] p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {r.name || "Без имени"}
                </div>
                <div className="text-xs text-white/60 truncate">{r.url}</div>
              </div>
              <div className="text-xs text-white/60 text-right whitespace-nowrap">
                {r.count24h} / 24ч
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-white/10 p-2 text-center">
                <div className="text-[11px] text-white/60">Fail %</div>
                <div className="font-medium">{r.failPct}</div>
              </div>
              <div className="rounded-lg border border-white/10 p-2 text-center">
                <div className="text-[11px] text-white/60">Retry %</div>
                <div className="font-medium">{r.retryPct}</div>
              </div>
              <div className="rounded-lg border border-white/10 p-2 col-span-2 text-center">
                <div className="text-[11px] text-white/60">Median Latency</div>
                <div className="font-medium">{r.latencyMed} ms</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 Десктопный вид */}
      <div className="hidden md:block overflow-auto rounded-xl border border-white/10">
        <table className="min-w-[860px] w-full text-sm">
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[36%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead className="bg-white/[0.04] text-white/80 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left">Эндпоинт</th>
              <th className="p-2 text-left">URL</th>
              <th className="p-2 text-left">24ч</th>
              <th className="p-2 text-left">Fail %</th>
              <th className="p-2 text-left">Retry %</th>
              <th className="p-2 text-left">Median (ms)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                <td className="p-2">{r.name}</td>
                <td className="p-2 truncate max-w-[300px]">{r.url}</td>
                <td className="p-2">{r.count24h}</td>
                <td className="p-2">{r.failPct}</td>
                <td className="p-2">{r.retryPct}</td>
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