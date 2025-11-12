"use client";

export default function LogMeta({ value }: { value: any }) {
  const v = value || {};

  const time = v.ts
    ? new Date(v.ts).toLocaleString("ru-RU", {
        dateStyle: "short",
        timeStyle: "medium",
      })
    : "—";

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
      {/* Время */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">Время</div>
        <div className="font-mono">{time}</div>
      </div>

      {/* Пользователь */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">Пользователь</div>
        <div>
          {v.user || "—"}
          {v.role && (
            <span className="text-white/50 ml-1">({v.role})</span>
          )}
        </div>
      </div>

      {/* IP / Session */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">IP / Session</div>
        <div className="font-mono text-xs break-all">
          {v.ip || "—"} {v.sessionId && <>• {v.sessionId}</>}
        </div>
      </div>

      {/* Модуль / Действие */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">Модуль / Действие</div>
        <div>
          {v.module || "—"} {v.action && <>/ {v.action}</>}
        </div>
      </div>

      {/* Объект */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">Объект</div>
        <div>
          {v.entityType || "—"}{" "}
          {v.entityId && (
            <span className="font-mono text-xs">#{v.entityId}</span>
          )}
        </div>
      </div>

      {/* Трассировка */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">Трассировка</div>
        <div className="font-mono text-xs break-all">
          {v.traceId || "—"} {v.requestId && <>• {v.requestId}</>}
        </div>
      </div>
    </section>
  );
}