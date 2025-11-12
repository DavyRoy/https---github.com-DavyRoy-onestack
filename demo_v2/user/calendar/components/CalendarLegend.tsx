import type { CalendarLegendMap } from "../data/mockUserCalendar";

const statusLabels: Record<string, string> = {
  confirmed: "Подтверждено",
  pending: "Ожидает",
  cancelled: "Отменено",
  due: "К оплате",
  paid: "Оплачено",
  delivering: "Доставка",
  delivered: "Доставлено",
};

export default function CalendarLegend({ legend }: { legend: CalendarLegendMap }) {
  return (
    <section className="space-y-2 rounded-2xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/70 px-4 py-3 text-xs text-[hsl(var(--muted))]">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--muted))]">Легенда</h3>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {Object.entries(legend).map(([type, statuses]) => (
          <div key={type} className="space-y-1">
            <p className="text-[hsl(var(--muted))] capitalize">{type === "booking" ? "Записи" : type === "payment" ? "Оплаты" : type === "order" ? "Заказы" : "Напоминания"}</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statuses).map(([status, className]) => (
                <span key={status} className={`inline-flex items-center rounded-full px-2 py-1 text-[0.7rem] font-semibold ${className}`}>
                  {statusLabels[status] ?? status}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
