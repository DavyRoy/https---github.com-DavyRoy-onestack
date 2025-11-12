// app/demo/admin/orders/components/AdminOrderAudit.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import * as Lucide from "lucide-react";
import type { AdminOrder } from "@/app/demo/admin/orders/data/mockAdminOrders";

type AuditItem = NonNullable<AdminOrder["audit"]>[number] & {
  at?: string;
  user?: string;
  text?: string;
  type?: string;
};

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function parseDateSafe(s?: string | null) {
  if (!s) return null;
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t) : null;
}

export default function AdminOrderAudit({ order }: { order: AdminOrder }) {
  const [q, setQ] = useState("");
  const [relative, setRelative] = useState(true);
  const [tick, setTick] = useState(0); // для автообновления «5 мин назад»

  // rtf мемоизируем, чтобы не создавать на каждый рендер
  const rtf = useMemo(
    () => new Intl.RelativeTimeFormat("ru", { numeric: "auto" }),
    []
  );

  const fmtExact = (s?: string) => {
    const d = parseDateSafe(s);
    if (!d) return s || "—";
    return new Intl.DateTimeFormat("ru", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  };

  const relativeFromNow = (d: Date) => {
    const diffMs = d.getTime() - Date.now();
    const sec = Math.round(diffMs / 1000);
    const abs = Math.abs(sec);

    if (abs < 60) return rtf.format(Math.trunc(sec), "second");
    const min = Math.round(sec / 60);
    if (Math.abs(min) < 60) return rtf.format(min, "minute");
    const hr = Math.round(min / 60);
    if (Math.abs(hr) < 24) return rtf.format(hr, "hour");
    const day = Math.round(hr / 24);
    if (Math.abs(day) < 30) return rtf.format(day, "day");
    const mon = Math.round(day / 30);
    if (Math.abs(mon) < 12) return rtf.format(mon, "month");
    const yr = Math.round(mon / 12);
    return rtf.format(yr, "year");
  };

  // автообновление «n минут назад» раз в минуту, только когда включено
  useEffect(() => {
    if (!relative) return;
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, [relative]);

  const items = useMemo<AuditItem[]>(() => {
    const raw: AuditItem[] = Array.isArray(order.audit) ? [...order.audit] : [];
    // новые сверху
    raw.sort((a, b) => (b.at || "").localeCompare(a.at || ""));
    if (!q.trim()) return raw;
    const needle = q.toLowerCase();
    return raw.filter(
      (a) =>
        (a.text || "").toLowerCase().includes(needle) ||
        (a.user || "").toLowerCase().includes(needle) ||
        (a.type || "").toLowerCase().includes(needle)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.audit, q, tick, relative]);

  const handleCopy = async (payload: { at?: string; user?: string; text?: string }) => {
    const line = `[${payload.at ?? ""}] ${payload.user ?? ""}: ${payload.text ?? ""}`.trim();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(line);
        alert("Скопировано в буфер");
      } else {
        // Fallback без ошибок в консоль
        window.prompt("Скопируйте запись вручную:", line);
      }
    } catch {
      window.prompt("Скопируйте запись вручную:", line);
    }
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5"
      aria-labelledby="order-audit-title"
    >
      {/* заголовок + инструменты */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-medium" id="order-audit-title">
          Аудит
        </div>

        <div className="min-w-0 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {/* поиск */}
          <div className="relative min-w-0 sm:w-72">
            <Lucide.Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQ("");
              }}
              placeholder="Поиск по аудиту…"
              className="w-full rounded-lg border border-white/15 bg-white/10 pl-7 pr-8 py-1.5 text-sm outline-none placeholder:text-white/40"
              aria-label="Поиск по аудиту"
            />
            {q && (
              <button
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded px-1 text-white/70 hover:bg-white/10"
                onClick={() => setQ("")}
                aria-label="Очистить поиск"
                title="Очистить"
              >
                ✕
              </button>
            )}
          </div>

          {/* относительное/точное время */}
          <label className="inline-flex items-center gap-2 text-xs text-white/80">
            <input
              type="checkbox"
              className="shrink-0"
              checked={relative}
              onChange={(e) => setRelative(e.target.checked)}
              aria-label="Включить отображение относительного времени"
            />
            <span className="whitespace-nowrap">относительное время</span>
          </label>
        </div>
      </div>

      {/* список */}
      <ol className="mt-3 space-y-2 text-sm" role="list" aria-live="polite">
        {items.map((a, i) => {
          const d = parseDateSafe(a.at);
          const when = d ? (relative ? relativeFromNow(d) : fmtExact(a.at)) : (a.at || "—");
          // стабильный key: ISO-время + тип + индекс
          const key = `${a.at ?? "na"}|${a.type ?? ""}|${i}`;
          return (
            <li
              key={key}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 text-xs text-white/60">
                  <span className="break-words">{when}</span>
                  {a.type ? (
                    <>
                      {" "}
                      • <span className="uppercase tracking-wide break-words">{a.type}</span>
                    </>
                  ) : null}
                  {a.user ? (
                    <>
                      {" "}
                      • <span className="text-white/70 break-words">{a.user}</span>
                    </>
                  ) : null}
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  <button
                    className="rounded-md border border-white/10 bg-white/10 p-1 hover:bg-white/15"
                    onClick={() => handleCopy(a)}
                    aria-label="Скопировать запись"
                    title="Скопировать запись"
                  >
                    <Lucide.Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {a.text ? (
                <div className="mt-1 leading-snug break-words whitespace-pre-wrap">
                  {a.text}
                </div>
              ) : (
                <div className="mt-1 text-white/60">—</div>
              )}
            </li>
          );
        })}

        {items.length === 0 && (
          <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-4 text-sm text-white/70 text-center">
            Записей не найдено {q ? "по текущему поиску." : "в этом заказе."}
          </li>
        )}
      </ol>
    </section>
  );
}