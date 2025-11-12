"use client";

type LogMetaValue = {
  ts?: string | number | Date;
  user?: string;
  role?: string;
  ip?: string;
  sessionId?: string;
  module?: string;
  action?: string;
  entityType?: string;
  entityId?: string | number;
  traceId?: string;
  requestId?: string;
};

function safeFormatDateUTC(input?: string | number | Date, locale = "ru-RU"): string {
  if (!input && input !== 0) return "—";
  const d = new Date(input);
  if (isNaN(d.getTime())) return "—";
  // Явная таймзона и полный набор полей → одинаково для SSR/CSR
  return new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(d);
}

export default function LogMeta({ value }: { value: LogMetaValue | null | undefined }) {
  const v: LogMetaValue = value ?? {};

  const time = safeFormatDateUTC(v.ts);

  const userLine = v.user ? (
    <>
      {v.user}
      {v.role ? <span className="text-white/50 ml-1">({v.role})</span> : null}
    </>
  ) : (
    "—"
  );

  const ipSess =
    v.ip || v.sessionId ? (
      <>
        {v.ip ?? "—"}
        {v.sessionId ? (
          <>
            {" "}
            • <span title="Session ID">{v.sessionId}</span>
          </>
        ) : null}
      </>
    ) : (
      "—"
    );

  const moduleAction =
    v.module || v.action ? (
      <>
        {v.module ?? "—"}
        {v.action ? <> / {v.action}</> : null}
      </>
    ) : (
      "—"
    );

  const entity =
    v.entityType || v.entityId ? (
      <>
        {v.entityType ?? "—"} {v.entityId ? <span className="font-mono text-xs">#{v.entityId}</span> : null}
      </>
    ) : (
      "—"
    );

  const traceReq =
    v.traceId || v.requestId ? (
      <>
        {v.traceId ?? "—"}
        {v.requestId ? (
          <>
            {" "}
            • <span title="Request ID">{v.requestId}</span>
          </>
        ) : null}
      </>
    ) : (
      "—"
    );

  return (
    <section
      className="
        rounded-2xl border border-white/15 bg-white/[0.05] p-4
        grid gap-3 text-sm
        sm:grid-cols-2 md:grid-cols-3
      "
      aria-label="Мета-информация события"
    >
      {/* Время */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">Время (UTC)</div>
        <div className="font-mono">{time}</div>
      </div>

      {/* Пользователь */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">Пользователь</div>
        <div>{userLine}</div>
      </div>

      {/* IP / Session */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">IP / Session</div>
        <div className="font-mono text-xs break-all">{ipSess}</div>
      </div>

      {/* Модуль / Действие */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">Модуль / Действие</div>
        <div>{moduleAction}</div>
      </div>

      {/* Объект */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">Объект</div>
        <div>{entity}</div>
      </div>

      {/* Трассировка */}
      <div>
        <div className="text-xs text-white/60 mb-0.5">Трассировка</div>
        <div className="font-mono text-xs break-all">{traceReq}</div>
      </div>
    </section>
  );
}