"use client";

import { useState, useMemo } from "react";

function tryStringify(v: any) {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function JsonBlock({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  const json = useMemo(() => JSON.stringify(value, null, 2), [value]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json ?? "");
      // демо-уведомление
      alert("Скопировано в буфер обмена");
    } catch {}
  };

  return (
    <div className="rounded-lg border border-white/10 p-3">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="text-xs text-white/60">{label}</div>
        <button
          onClick={copy}
          className="text-[11px] rounded border border-white/15 px-2 py-0.5 hover:bg-white/[0.08]"
        >
          Копировать
        </button>
      </div>
      <pre className="text-xs overflow-x-auto max-h-60 whitespace-pre">
        {json}
      </pre>
    </div>
  );
}

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

  const changes: Change[] = useMemo(() => {
    const left = before ?? {};
    const right = after ?? {};
    const keys = Array.from(new Set([...Object.keys(left), ...Object.keys(right)]));

    return keys
      .map<Change | null>((k) => {
        const a = left[k];
        const b = right[k];

        if (a === undefined && b !== undefined) return { key: k, type: "added", a, b };
        if (b === undefined && a !== undefined) return { key: k, type: "removed", a, b };

        // более корректная проверка равенства сложных структур
        const sa = tryStringify(a);
        const sb = tryStringify(b);
        if (sa !== sb) return { key: k, type: "changed", a, b };

        return null;
      })
      .filter(Boolean) as Change[];
  }, [before, after]);

  return (
    <section className="grid gap-3">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Просмотр изменений">
        {[
          { id: "payload", name: "Payload" },
          { id: "diff", name: "Before/After" },
          { id: "raw", name: "Raw JSON" },
        ].map((t) => {
          const active = tab === (t.id as typeof tab);
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => setTab(t.id as any)}
              className={`rounded-lg px-3 py-1.5 border transition ${
                active ? "bg-white/10 border-white/20" : "border-white/15 hover:bg-white/[0.08]"
              }`}
            >
              {t.name}
            </button>
          );
        })}
      </div>

      {/* Payload */}
      {tab === "payload" && (
        <div role="tabpanel" id="panel-payload" aria-labelledby="tab-payload">
          <JsonBlock label="Payload" value={payload || {}} />
        </div>
      )}

      {/* Diff */}
      {tab === "diff" && (
        <div
          role="tabpanel"
          id="panel-diff"
          aria-labelledby="tab-diff"
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
                return (
                  <div
                    key={c.key}
                    className="grid gap-2 md:grid-cols-3 items-start text-xs"
                  >
                    <div className="truncate">
                      <span className={`px-2 py-0.5 rounded mr-2 ${badgeClass}`}>
                        {c.type}
                      </span>
                      <span className="font-mono break-all">{c.key}</span>
                    </div>
                    <pre className="bg-white/5 rounded p-2 overflow-x-auto max-h-60">
                      {JSON.stringify(c.a, null, 2)}
                    </pre>
                    <pre className="bg-white/5 rounded p-2 overflow-x-auto max-h-60">
                      {JSON.stringify(c.b, null, 2)}
                    </pre>
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
          id="panel-raw"
          aria-labelledby="tab-raw"
          className="grid md:grid-cols-2 gap-3"
        >
          <JsonBlock label="Before" value={before || {}} />
          <JsonBlock label="After" value={after || {}} />
        </div>
      )}
    </section>
  );
}