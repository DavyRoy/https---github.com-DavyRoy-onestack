"use client";

export default function HealthHeader({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const set = (k: string, val: any) => onChange({ ...v, [k]: val });

  return (
    <div
      className="
        grid gap-2 sm:gap-3
        grid-cols-1 sm:grid-cols-2 md:grid-cols-4
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-3 sm:p-4 w-full max-w-full min-w-0
      "
      aria-label="Фильтры состояния системы"
    >
      {/* Диапазон */}
      <label className="grid gap-1 text-xs text-white/60">
        <span className="sr-only sm:not-sr-only">Период</span>
        <select
          className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10"
          value={v.range ?? "24h"}
          onChange={(e) => set("range", e.target.value)}
        >
          <option value="1h">1ч</option>
          <option value="24h">24ч</option>
          <option value="7d">7д</option>
          <option value="30d">30д</option>
        </select>
      </label>

      {/* Сервис */}
      <label className="grid gap-1 text-xs text-white/60">
        <span className="sr-only sm:not-sr-only">Сервис</span>
        <select
          className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10"
          value={v.service ?? "all"}
          onChange={(e) => set("service", e.target.value)}
        >
          <option value="all">Все сервисы</option>
          <option value="payments">Payments</option>
          <option value="integrations">Integrations</option>
          <option value="messaging">Messaging</option>
          <option value="webhooks">Webhooks</option>
        </select>
      </label>

      {/* Статус */}
      <label className="grid gap-1 text-xs text-white/60">
        <span className="sr-only sm:not-sr-only">Статус</span>
        <select
          className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10"
          value={v.status ?? ""}
          onChange={(e) => set("status", e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="ok">OK</option>
          <option value="degraded">Degraded</option>
          <option value="down">Down</option>
        </select>
      </label>

      {/* Локация */}
      <label className="grid gap-1 text-xs text-white/60">
        <span className="sr-only sm:not-sr-only">Локация</span>
        <input
          placeholder="Локация"
          className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10 placeholder:text-white/40"
          value={v.location ?? ""}
          onChange={(e) => set("location", e.target.value)}
        />
      </label>
    </div>
  );
}