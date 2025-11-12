"use client";

import { useMemo, useState, useId, KeyboardEvent } from "react";

/* ------------------------ helpers ------------------------ */
function tryStringify(v: any, space = 2): string {
  try {
    return JSON.stringify(v, null, space);
  } catch {
    // как fallback попытаемся привести к строке
    try {
      return String(v);
    } catch {
      return "";
    }
  }
}

function parsePct(p: unknown): number | null {
  const n = Number(String(p ?? "").replace("%", "").trim());
  return Number.isFinite(n) ? n : null;
}

/* ------------------------ JSON block ------------------------ */
function JsonBlock({ label, value }: { label: string; value: any }) {
  const json = useMemo(() => tryStringify(value, 2), [value]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      alert("Скопировано в буфер обмена");
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="rounded-lg border border-white/10 p-3">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="text-xs text-white/60">{label}</div>
        <button
          onClick={copy}
          className="text-[11px] rounded border border-white/15 px-2 py-0.5 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Копировать
        </button>
      </div>
      <pre className="text-xs overflow-x-auto max-h-60 whitespace-pre">{json}</pre>
    </div>
  );
}

/* ------------------------ types ------------------------ */
type Change = {
  key: string;
  type: "added" | "removed" | "changed";
  a: any;
  b: any;
};

export default function LogDiff({
  before,
  after,
  payload,
}: {
  before: any;
  after: any;
  payload: any;
}) {
  const [tab, setTab] = useState<"payload" | "diff" | "raw">("payload");
  const uid = useId(); // чтобы уникализировать aria-id, если компонент на странице встречается несколько раз

  const changes: Change[] = useMemo(() => {
    const left = before ?? {};
    const right = after ?? {};
    const keys = Array.from(new Set([...Object.keys(left), ...Object.keys(right)]));

    const rows = keys
      .map<Change | null>((k) => {
        const a = left[k];
        const b = right[k];

        if (a === undefined && b !== undefined) return { key: k, type: "added", a, b };
        if (b === undefined && a !== undefined) return { key: k, type: "removed", a, b };

        // сравниваем по стабильной сериализации (глубокое сравнение простым способом)
        const sa = tryStringify(a, 0);
        const sb = tryStringify(b, 0);
        if (sa !== sb) return { key: k, type: "changed", a, b };

        return null;
      })
      .filter(Boolean) as Change[];

    // детерминированная сортировка: по типу (removed → changed → added), потом по ключу
    const weight = { removed: 0, changed: 1, added: 2 } as const;
    rows.sort((x, y) => {
      const t = weight[x.type] - weight[y.type];
      return t !== 0 ? t : x.key.localeCompare(y.key);
    });

    return rows;
  }, [before, after]);

  const tabs = [
    { id: "payload" as const, name: "Payload" },
    { id: "diff" as const, name: "Before/After" },
    { id: "raw" as const, name: "Raw JSON" },
  ];

  const onTabsKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.id === tab);
    if (idx === -1) return;
    const nextIdx =
      e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
    setTab(tabs[nextIdx].id);
  };

  const count = {
    added: changes.filter((c) => c.type === "added").length,
    removed: changes.filter((c) => c.type === "removed").length,
    changed: changes.filter((c) => c.type === "changed").length,
  };

  return (
    <section className="grid gap-3">
      {/* Tabs */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Просмотр изменений"
        onKeyDown={onTabsKey}
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          const tabId = `tab-${t.id}-${uid}`;
          const panelId = `panel-${t.id}-${uid}`;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              aria-controls={panelId}
              id={tabId}
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-3 py-1.5 border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                active ? "bg-white/10 border-white/20" : "border-white/15 hover:bg-white/[0.08]"
              }`}
            >
              {t.name}
              {t.id === "diff" && (
                <span className="ml-2 text-[11px] text-white/60">
                  +{count.added} / ~{count.changed} / −{count.removed}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Payload */}
      {tab === "payload" && (
        <div role="tabpanel" id={`panel-payload-${uid}`} aria-labelledby={`tab-payload-${uid}`}>
          <JsonBlock label="Payload" value={payload || {}} />
        </div>
      )}

      {/* Diff */}
      {tab === "diff" && (
        <div
          role="tabpanel"
          id={`panel-diff-${uid}`}
          aria-labelledby={`tab-diff-${uid}`}
          className="rounded-2xl border border-white/15 bg-white/[0.05] p-3"
        >
          {changes.length === 0 ? (
            <div className="text-sm text-white/70">Изменений нет</div>
          ) : (
            <div className="grid gap-2">
              {changes.map((c) => {
                const badgeClass =
                  c.type === "changed"
                    ? "bg-amber-500/20"
                    : c.type === "added"
                    ? "bg-emerald-500/20"
                    : "bg-rose-500/20";

                // Подсветим, если изменение похоже на процент (удобно для метрик)
                const aPct = parsePct(c.a);
                const bPct = parsePct(c.b);
                const showPctHint = aPct !== null || bPct !== null;

                return (
                  <div key={c.key} className="grid gap-2 md:grid-cols-3 items-start text-xs">
                    <div className="truncate">
                      <span className={`px-2 py-0.5 rounded mr-2 ${badgeClass}`}>{c.type}</span>
                      <span className="font-mono break-all">{c.key}</span>
                    </div>

                    <pre className="bg-white/5 rounded p-2 overflow-x-auto max-h-60">
                      {tryStringify(c.a, 2)}
                    </pre>
                    <pre className="bg-white/5 rounded p-2 overflow-x-auto max-h-60">
                      {tryStringify(c.b, 2)}
                    </pre>

                    {showPctHint && (
                      <div className="md:col-span-3 text-[11px] text-white/50">
                        {aPct !== null && bPct !== null
                          ? `Δ = ${(bPct - aPct).toFixed(2)}%`
                          : "Значение похоже на процент, но сравнение нечисловое."}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Raw */}
      {tab === "raw" && (
        <div
          role="tabpanel"
          id={`panel-raw-${uid}`}
          aria-labelledby={`tab-raw-${uid}`}
          className="grid md:grid-cols-2 gap-3"
        >
          <JsonBlock label="Before" value={before || {}} />
          <JsonBlock label="After" value={after || {}} />
        </div>
      )}
    </section>
  );
}